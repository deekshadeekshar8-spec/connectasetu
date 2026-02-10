
# Connectasetu CRM Portal

A full-stack employee management and call tracking system.

## Features
- **Strict RBAC**: Roles for Admin, TeamA, TeamB, and Employees.
- **Truecaller Logic**: Automatic identification of callers via linked Contacts DB.
- **Excel Hub**: Bulk upload contacts via `.xlsx`.
- **Call Performance**: Visual analytics for call volume and outcomes.

## Setup
1. **Backend**:
   - `npm install express mongoose jsonwebtoken bcryptjs multer xlsx`
   - Configure `JWT_SECRET` and `MONGODB_URI` in `.env`.
2. **Frontend**:
   - Built with React 19 + Tailwind CSS.
   - Run via local server.
3. **Syncing**:
   - Ensure Mobile SDK uses the `POST /api/calls/sync` endpoint with a valid JWT.

## Security
- Password hashing with Bcrypt.
- Middleware verification for every sensitive route.
- Admin-only access for global statistics and call recordings.
