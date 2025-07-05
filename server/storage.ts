import { employees, shifts, sessions, type Employee, type InsertEmployee, type Shift, type InsertShift, type Session, type InsertSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Employee methods
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByUsername(username: string): Promise<Employee | undefined>;
  getAllEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee | undefined>;

  // Shift methods
  getShifts(year: number, month: number): Promise<Shift[]>;
  getTodayShifts(): Promise<Shift[]>;
  getShift(date: string, shiftType: string): Promise<Shift | undefined>;
  createShift(shift: InsertShift): Promise<Shift>;
  updateShift(id: number, shift: Partial<Shift>): Promise<Shift | undefined>;
  deleteShift(id: number): Promise<boolean>;

  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  deleteSession(id: string): Promise<boolean>;
  cleanExpiredSessions(): Promise<void>;
}

export class MemStorage implements IStorage {
  private employees: Map<number, Employee>;
  private shifts: Map<number, Shift>;
  private sessions: Map<string, Session>;
  private currentEmployeeId: number;
  private currentShiftId: number;

  constructor() {
    this.employees = new Map();
    this.shifts = new Map();
    this.sessions = new Map();
    this.currentEmployeeId = 1;
    this.currentShiftId = 1;
    
    // Initialize with predefined employees
    this.initializeEmployees();
  }

  private initializeEmployees() {
    const predefinedEmployees = [
      {
        name: "Влад Шайн",
        username: "vladshain",
        password: "password123",
        role: "admin",
        initials: "ВШ",
        color: "pink",
        telegramId: "1120409420",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Костя Молоков",
        username: "kostyamolokov",
        password: "password123",
        role: "worker",
        initials: "КМ",
        color: "green",
        telegramId: "535994249",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Андрей Костин",
        username: "andreykosting",
        password: "password123",
        role: "worker",
        initials: "АК",
        color: "blue",
        telegramId: "1007433194",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Гость",
        username: "liya",
        password: "password123",
        role: "guest",
        initials: "Г",
        color: "purple",
        telegramId: null as string | null,
        avatarUrl: null,
      },
    ];

    predefinedEmployees.forEach(emp => {
      const employee: Employee = { 
        ...emp, 
        id: this.currentEmployeeId++,
        frame: 'default',
        avatarUrl: null
      };
      this.employees.set(employee.id, employee);
    });
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByUsername(username: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(emp => emp.username === username);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const employee: Employee = { 
      ...insertEmployee, 
      id: this.currentEmployeeId++,
      telegramId: insertEmployee.telegramId || null,
      frame: insertEmployee.frame ?? 'default',
      avatarUrl: insertEmployee.avatarUrl ?? null
    };
    this.employees.set(employee.id, employee);
    return employee;
  }

  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee | undefined> {
    const existing = this.employees.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...employee };
    this.employees.set(id, updated);
    return updated;
  }

  async getShifts(year: number, month: number): Promise<Shift[]> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
    
    return Array.from(this.shifts.values()).filter(shift => 
      shift.date >= startDate && shift.date <= endDate
    );
  }

  async getTodayShifts(): Promise<Shift[]> {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.shifts.values()).filter(shift => shift.date === today);
  }

  async getShift(date: string, shiftType: string): Promise<Shift | undefined> {
    return Array.from(this.shifts.values()).find(shift => 
      shift.date === date && shift.shiftType === shiftType
    );
  }

  async createShift(insertShift: InsertShift): Promise<Shift> {
    const shift: Shift = { ...insertShift, id: this.currentShiftId++ };
    this.shifts.set(shift.id, shift);
    return shift;
  }

  async updateShift(id: number, shift: Partial<Shift>): Promise<Shift | undefined> {
    const existing = this.shifts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...shift };
    this.shifts.set(id, updated);
    return updated;
  }

  async deleteShift(id: number): Promise<boolean> {
    return this.shifts.delete(id);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const session: Session = { ...insertSession, id: randomUUID() };
    this.sessions.set(session.id, session);
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(id);
      return undefined;
    }
    
    return session;
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  async cleanExpiredSessions(): Promise<void> {
    const now = new Date();
    Array.from(this.sessions.entries()).forEach(([id, session]) => {
      if (new Date(session.expiresAt) < now) {
        this.sessions.delete(id);
      }
    });
  }
}

export const storage = new MemStorage();
