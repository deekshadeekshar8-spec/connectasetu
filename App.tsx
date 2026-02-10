
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Role, User, CallLog, Notification } from './types';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ContactsPage from './pages/ContactsPage';
import CallsPage from './pages/CallsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import PersonnelPage from './pages/PersonnelPage';
import AssistantWidget from './components/AssistantWidget';
import DeviceSyncPage from './pages/DeviceSyncPage';

// --- MOCK API INTERCEPTOR ---
export const appFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  if (url.includes('/api/')) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem('connectasetu_user');
    const currentUser = stored ? JSON.parse(stored) : null;
    let data: any = null;

    if (url.includes('/api/auth/me')) {
      data = currentUser;
    } else if (url.includes('/api/notifications')) {
      data = [
        { id: '1', title: 'Security Alert', message: 'Unauthorized device sync attempt detected.', type: 'ALERT', timestamp: new Date().toISOString(), isRead: false },
        { id: '2', title: 'Sync Successful', message: 'Last 24 interactions synced with core.', type: 'SUCCESS', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: true }
      ];
    } else if (url.includes('/api/device/sync-calls')) {
      data = { status: 'SUCCESS', syncedCount: 12, signature: 'SHA256_VERIFIED' };
    } else if (url.includes('/api/calls/history')) {
      data = [
        { id: 'c1', customerNumber: '9876543210', status: 'connected', durationSeconds: 342, outcome: 'Interested', createdAt: new Date().toISOString(), syncSource: 'DEVICE_ONLY', deviceId: currentUser?.deviceId || 'DEV_8829', hashSignature: '8f2b...3e1a', isVerified: true }
      ];
    } else if (url.includes('/api/admin/team/employees')) {
      data = [
        { id: 'e1', name: 'Arjun Mehta', role: Role.TEAMA_EMPLOYEE, team: 'teamA', designation: 'Operations Associate', deviceId: 'DEV_8829', status: 'ACTIVE', lastSyncAt: new Date().toISOString() },
        { id: 'e2', name: 'Priya Das', role: Role.TEAMB_EMPLOYEE, team: 'teamB', designation: 'Client Relations', deviceId: 'DEV_4410', status: 'PENDING', lastSyncAt: new Date().toISOString() }
      ];
    } else {
      data = { status: 'success' };
    }

    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return window.fetch(input, init);
};

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string, role: Role) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  bindDevice: (deviceId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: Role[] }> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('connectasetu_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  const login = async (name: string, email: string, role: Role) => {
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: name || 'Operator',
      email,
      phoneNumber: '9998887776',
      role,
      team: role.includes('a') ? 'teamA' : role.includes('b') ? 'teamB' : 'none',
      designation: 'Staff',
      deviceId: role.includes('employee') ? 'DEV_' + Math.floor(Math.random()*9000 + 1000) : undefined,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
    setUser(mockUser);
    localStorage.setItem('connectasetu_user', JSON.stringify(mockUser));
  };

  const signup = async (data: any) => {
    console.log("Enrollment Requested:", data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('connectasetu_user');
  };

  const bindDevice = (deviceId: string) => {
    if (user) {
      const updated = { ...user, deviceId };
      setUser(updated);
      localStorage.setItem('connectasetu_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, bindDevice }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={
            <ProtectedRoute allowedRoles={[Role.ADMIN, Role.TEAMA_ADMIN, Role.TEAMB_ADMIN, Role.TEAMA_EMPLOYEE, Role.TEAMB_EMPLOYEE]}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<RoleGateway />} />
            <Route path="dashboard" element={<RoleGateway />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="calls" element={<CallsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="personnel" element={<PersonnelPage />} />
            <Route path="sync" element={<DeviceSyncPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AssistantWidget />
      </Router>
    </AuthProvider>
  );
}

const RoleGateway = () => {
  const { user } = useAuth();
  if (user?.role.includes('admin')) return <AdminDashboard />;
  return <EmployeeDashboard />;
}
