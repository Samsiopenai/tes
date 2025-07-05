import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin' | 'worker' | 'guest'
  initials: text("initials").notNull(),
  color: text("color").notNull(),
  telegramId: text("telegram_id"),
  frame: text("frame").default("default"),
  avatarUrl: text("avatar_url"),
});

export const shifts = sqliteTable("shifts", {
  id: integer("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD format
  shiftType: text("shift_type").notNull(), // 'day' | 'night'
  employeeId: integer("employee_id").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
});

export const insertShiftSchema = createInsertSchema(shifts).omit({
  id: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Shift = typeof shifts.$inferSelect;
export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
