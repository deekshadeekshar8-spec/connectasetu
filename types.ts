
export enum Role {
  ADMIN = 'super_admin',
  TEAMA_ADMIN = 'team_admin_a',
  TEAMB_ADMIN = 'team_admin_b',
  TEAMA_EMPLOYEE = 'employee_a',
  TEAMB_EMPLOYEE = 'employee_b'
}

export type CallOutcome = 'not answered' | 'not interested' | 'invalid' | 'interested' | 'Answered' | 'book plot visit';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
  team: 'teamA' | 'teamB' | 'none';
  designation?: string;
  deviceId?: string; // Bound hardware ID
  lastSyncAt?: string;
  createdAt: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  team: 'teamA' | 'teamB' | 'none';
  securityState: 'VERIFIED' | 'UNVERIFIED';
  registeredDate: string;
}

export interface CallLog {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeTeam: 'teamA' | 'teamB' | 'none';
  customerNumber: string;
  status: 'connected' | 'missed' | 'failed';
  durationSeconds: number;
  outcome?: string;
  notes?: string;
  createdAt: string;
  syncSource: 'DEVICE_ONLY' | 'SYSTEM_CORE';
  deviceId: string;
  hashSignature: string;
  isVerified: boolean;
  phoneNumber?: string;
  contactName?: string;
  startTime?: string;
  endTime?: string;
  direction?: 'in' | 'out';
  callType?: string;
  source?: string;
  recordingUrl?: string;
  recordingConsent?: boolean;
}

export interface DailyReport {
  id: string;
  employeeId: string;
  employeeName: string;
  team: 'teamA' | 'teamB';
  date: string;
  tasks?: string;
  callsCount?: number;
  followUps: number;
  remarks: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS';
  timestamp: string;
  isRead: boolean;
}
