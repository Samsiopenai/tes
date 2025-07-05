export interface Employee {
  id: number;
  name: string;
  username: string;
  role: 'admin' | 'worker' | 'guest';
  initials: string;
  color: string;
  telegramId?: string;
  frame?: string;
  avatarUrl?: string;
}

export interface Shift {
  id: number;
  date: string;
  shiftType: 'day' | 'night';
  employeeId: number;
}

export interface AuthResponse {
  token: string;
  employee: Employee;
}

export interface DraggedEmployee {
  id: number;
  name: string;
  initials: string;
  color: string;
}
