
/**
 * connectasetu - Full Operational Backend with Team-Locked RBAC
 */
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'connectasetu_quantum_key';
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SCHEMAS ---

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, default: 'hashed_pass' },
  // Explicitly defined roles for granular team management
  role: { 
    type: String, 
    enum: ['super_admin', 'team_admin_a', 'team_admin_b', 'employee_a', 'employee_b'],
    required: true
  },
  team: { 
    type: String, 
    enum: ['teamA', 'teamB', 'none'],
    required: true
  },
  phone: String,
  designation: String,
  deviceId: String, // Binding field for anti-fake sync
  joiningDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const CallSchema = new mongoose.Schema({
  employee_id: mongoose.Schema.Types.ObjectId,
  employeeName: String,
  employeeTeam: String,
  customer_number: String,
  status: { type: String, enum: ['connected', 'missed', 'failed'] },
  duration: Number,
  outcome: String,
  notes: String,
  // SECURITY & AUDIT
  sync_source: { type: String, default: 'DEVICE_ONLY' },
  device_id: String,
  hash_signature: String,
  // LEGAL COMPLIANCE: Tracking recording consent per-interaction
  recordingConsent: { type: Boolean, default: false },
  recordingUrl: String,
  created_at: { type: Date, default: Date.now }
});

const DailyReportSchema = new mongoose.Schema({
  employee_id: mongoose.Schema.Types.ObjectId,
  employeeName: String,
  team: String,
  date: { type: Date, default: Date.now },
  tasks: String,
  calls_count: Number,
  followUps: Number,
  remarks: String,
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  approved_by: String,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Call = mongoose.model('Call', CallSchema);
const DailyReport = mongoose.model('DailyReport', DailyReportSchema);

// --- SEED DATA ---
const seedSystem = async () => {
  if (await User.countDocuments() === 0) {
    const users = [
      { name: 'Global Admin', email: 'admin@connectasetu.com', role: 'super_admin', team: 'none', phone: '9999999999', designation: 'General Manager' },
      { name: 'Unit A Supervisor', email: 'admin.a@connectasetu.com', role: 'team_admin_a', team: 'teamA', phone: '8888888888', designation: 'Team Lead' },
      { name: 'Unit B Supervisor', email: 'admin.b@connectasetu.com', role: 'team_admin_b', team: 'teamB', phone: '7777777777', designation: 'Team Lead' },
      { name: 'Arjun Mehta', email: 'arjun@connectasetu.com', role: 'employee_a', team: 'teamA', phone: '9111111111', designation: 'Field Sales', deviceId: 'DEV_8829' },
      { name: 'Priya Das', email: 'priya@connectasetu.com', role: 'employee_b', team: 'teamB', phone: '9222222222', designation: 'Tele-Sales', deviceId: 'DEV_4410' }
    ];
    await User.insertMany(users);
    console.log("Team-Enabled Backend Initialized.");
  }
};
seedSystem();

// --- ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARE ---
const authorize = (roles = []) => (req, res, next) => {
  // Extracting from headers for simulation (usually decoded from JWT)
  const userRole = req.headers['x-role'] || 'super_admin'; 
  const userTeam = req.headers['x-team'] || 'none';
  const userId = req.headers['x-userid'] || 'mock_id';
  const userName = req.headers['x-username'] || 'Admin';

  req.user = { role: userRole, team: userTeam, id: userId, name: userName };

  if (roles.length && !roles.includes(userRole)) {
    return res.status(403).json({ message: 'Forbidden: Security protocol blocks this role from access.' });
  }
  next();
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.json({ token: 'mock_jwt_payload', user });
  } else {
    res.status(401).json({ message: 'Identity verification failed.' });
  }
});

// --- TEAM-LOCKED MANAGEMENT ROUTES ---

/**
 * Fetch Team Members
 * - Super Admin sees everyone
 * - Team Admins only see their respective team members
 */
app.get('/api/admin/team/employees', authorize(['super_admin', 'team_admin_a', 'team_admin_b']), async (req, res) => {
  let query = { role: { $regex: 'employee' } };
  
  if (req.user.role === 'team_admin_a') query.team = 'teamA';
  else if (req.user.role === 'team_admin_b') query.team = 'teamB';
  else if (req.user.role !== 'super_admin') return res.status(403).json({ error: "Access Denied" });

  const employees = await User.find(query).select('-password');
  res.json(employees);
});

/**
 * Manage Team Member (Update details)
 * - Team admins can update their own team's employee details
 */
app.put('/api/admin/employee/:id', authorize(['super_admin', 'team_admin_a', 'team_admin_b']), async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    // SECURITY: Verify boundary
    const isSuperAdmin = req.user.role === 'super_admin';
    const isCorrectTeamAdmin = (req.user.role === 'team_admin_a' && employee.team === 'teamA') || 
                               (req.user.role === 'team_admin_b' && employee.team === 'teamB');

    if (!isSuperAdmin && !isCorrectTeamAdmin) {
      return res.status(403).json({ error: "Forbidden: Personnel management restricted to your unit." });
    }

    const { name, phone, designation, deviceId } = req.body;
    if (name) employee.name = name;
    if (phone) employee.phone = phone;
    if (designation) employee.designation = designation;
    if (deviceId) employee.deviceId = deviceId; 

    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Personnel update failed." });
  }
});

/**
 * Fetch and Approve Daily Reports
 * - Team Admins are restricted to their own team's reporting pipeline
 */
app.get('/api/admin/all-reports', authorize(['super_admin', 'team_admin_a', 'team_admin_b']), async (req, res) => {
  let query = {};
  
  if (req.user.role === 'team_admin_a') query.team = 'teamA';
  else if (req.user.role === 'team_admin_b') query.team = 'teamB';
  
  const reports = await DailyReport.find(query).sort({ created_at: -1 });
  res.json(reports);
});

app.put('/api/admin/report/:id', authorize(['super_admin', 'team_admin_a', 'team_admin_b']), async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    // SECURITY: Prevent a Team Admin from approving another team's report
    const isSuperAdmin = req.user.role === 'super_admin';
    const isCorrectTeamAdmin = (req.user.role === 'team_admin_a' && report.team === 'teamA') || 
                               (req.user.role === 'team_admin_b' && report.team === 'teamB');

    if (!isSuperAdmin && !isCorrectTeamAdmin) {
      return res.status(403).json({ error: "Authorization Error: Cannot approve cross-unit reports." });
    }

    report.status = req.body.status;
    report.approved_by = req.user.name;
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Commit Error" });
  }
});

// --- TELEMETRY & RECORDING ROUTES ---

app.get('/api/calls/history', authorize(), async (req, res) => {
  let query = { employee_id: req.user.id };
  
  if (req.user.role === 'super_admin') query = {};
  else if (req.user.role === 'team_admin_a') query = { employeeTeam: 'teamA' };
  else if (req.user.role === 'team_admin_b') query = { employeeTeam: 'teamB' };
  
  const history = await Call.find(query).sort({ created_at: -1 });
  res.json(history);
});

app.get('/api/calls/:id/recording', authorize(), async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call) return res.status(404).json({ error: "Log not found" });

    // Access rights check
    const isOwner = call.employee_id.toString() === req.user.id;
    const isSuperAdmin = req.user.role === 'super_admin';
    const isTeamAdmin = (req.user.role === 'team_admin_a' && call.employeeTeam === 'teamA') ||
                        (req.user.role === 'team_admin_b' && call.employeeTeam === 'teamB');

    if (!isOwner && !isSuperAdmin && !isTeamAdmin) {
      return res.status(403).json({ error: "Forbidden: You do not have clearance for this audio asset." });
    }

    if (call.recordingConsent || isSuperAdmin) {
      return res.json({ url: call.recordingUrl });
    } else {
      return res.status(403).json({ error: "Legal Restriction: User consent was not recorded." });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Gateway Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`connectasetu Backend Online with Role Boundaries on Port ${PORT}`));
