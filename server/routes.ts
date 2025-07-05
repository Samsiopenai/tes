import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShiftSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const session = await storage.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ message: 'Недействительная сессия' });
    }

    const employee = await storage.getEmployee(session.employeeId);
    if (!employee) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.user = employee;
    next();
  };

  // Role-based access control
  const requireRole = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Недостаточно прав доступа' });
      }
      next();
    };
  };

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Введите логин и пароль' });
      }

      const employee = await storage.getEmployeeByUsername(username);
      if (!employee || employee.password !== password) {
        return res.status(401).json({ message: 'Неверный логин или пароль' });
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
      const session = await storage.createSession({
        employeeId: employee.id,
        createdAt: new Date().toISOString(),
        expiresAt,
      });

      res.json({
        token: session.id,
        employee: {
          id: employee.id,
          name: employee.name,
          username: employee.username,
          role: employee.role,
          initials: employee.initials,
          color: employee.color,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  app.post('/api/auth/logout', requireAuth, async (req: any, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      res.json({ message: 'Выход выполнен' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  app.get('/api/auth/me', requireAuth, async (req: any, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      username: req.user.username,
      role: req.user.role,
      initials: req.user.initials,
      color: req.user.color,
    });
  });

  // Employee routes
  app.get('/api/employees', requireAuth, async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        username: emp.username,
        role: emp.role,
        initials: emp.initials,
        color: emp.color,
        telegramId: emp.telegramId,
      })));
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  app.patch('/api/employees/:id', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { telegramId } = req.body;
      
      const updated = await storage.updateEmployee(id, { telegramId });
      if (!updated) {
        return res.status(404).json({ message: 'Сотрудник не найден' });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  // Shift routes
  app.get('/api/shifts/:year/:month', requireAuth, async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      const shifts = await storage.getShifts(year, month);
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  app.post('/api/shifts', requireAuth, requireRole(['admin', 'worker']), async (req, res) => {
    try {
      const shiftData = insertShiftSchema.parse(req.body);
      
      // Check if shift already exists
      const existingShift = await storage.getShift(shiftData.date, shiftData.shiftType);
      let shift;
      let isUpdate = false;
      
      if (existingShift) {
        // Update existing shift
        shift = await storage.updateShift(existingShift.id, {
          employeeId: shiftData.employeeId,
        });
        isUpdate = true;
      } else {
        // Create new shift
        shift = await storage.createShift(shiftData);
      }

      // Send Telegram notification
      try {
        const employee = await storage.getEmployee(shiftData.employeeId);
        if (employee?.telegramId) {
          const botToken = process.env.TELEGRAM_BOT_TOKEN || '7679093791:AAEljqJ8kDjE1m3dLgLq8dBcmi2qejpC5ww';
          const shiftTypeText = shiftData.shiftType === 'day' ? '🌅 Дневная' : '🌙 Ночная';
          const actionText = isUpdate ? 'изменена' : 'назначена';
          
          const message = `🎬 CAMERA TOON - Уведомление о смене\n\n` +
                         `👤 ${employee.name}\n` +
                         `📅 ${shiftData.date}\n` +
                         `⏰ ${shiftTypeText} смена ${actionText}\n\n` +
                         `✅ Назначил: ${req.user.name}`;

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: employee.telegramId,
              text: message,
              parse_mode: 'HTML',
            }),
          });
        }
      } catch (telegramError) {
        console.error('Telegram notification error:', telegramError);
        // Don't fail the shift creation if telegram fails
      }

      res.json(shift);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  app.delete('/api/shifts/:id', requireAuth, requireRole(['admin', 'worker']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteShift(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Смена не найдена' });
      }
      
      res.json({ message: 'Смена удалена' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  app.get('/api/shifts/today', requireAuth, async (req, res) => {
    try {
      const shifts = await storage.getTodayShifts();
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  // Telegram routes
  app.post('/api/telegram/test', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { message } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN || '7679093791:AAEljqJ8kDjE1m3dLgLq8dBcmi2qejpC5ww';
      
      // Test bot by sending message to admin
      const adminEmployee = await storage.getEmployee(req.user.id);
      if (!adminEmployee?.telegramId) {
        return res.status(400).json({ message: 'У администратора не настроен Telegram ID' });
      }

      const telegramMessage = message || 'Тест бота CAMERA TOON - связь установлена!';
      
      // Send test message via Telegram API
      const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: adminEmployee.telegramId,
          text: `🎬 CAMERA TOON\n\n${telegramMessage}`,
          parse_mode: 'HTML',
        }),
      });

      if (!telegramResponse.ok) {
        const error = await telegramResponse.json();
        throw new Error(`Telegram API error: ${error.description}`);
      }

      res.json({ 
        message: 'Тест бота успешно выполнен',
        details: 'Сообщение отправлено в Telegram'
      });
    } catch (error: any) {
      console.error('Telegram test error:', error);
      res.status(500).json({ 
        message: 'Ошибка тестирования бота',
        error: error.message 
      });
    }
  });

  app.post('/api/telegram/broadcast', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { message } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN || '7679093791:AAEljqJ8kDjE1m3dLgLq8dBcmi2qejpC5ww';
      
      if (!message) {
        return res.status(400).json({ message: 'Сообщение не может быть пустым' });
      }

      // Get all employees with Telegram IDs
      const employees = await storage.getAllEmployees();
      const employeesWithTelegram = employees.filter(emp => emp.telegramId);

      if (employeesWithTelegram.length === 0) {
        return res.status(400).json({ message: 'Нет сотрудников с настроенным Telegram' });
      }

      const results = [];
      
      for (const employee of employeesWithTelegram) {
        try {
          const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: employee.telegramId,
              text: `🎬 CAMERA TOON - Уведомление\n\n${message}\n\n📅 От: ${req.user.name}`,
              parse_mode: 'HTML',
            }),
          });

          if (telegramResponse.ok) {
            results.push({ employee: employee.name, status: 'success' });
          } else {
            const error = await telegramResponse.json();
            results.push({ employee: employee.name, status: 'error', error: error.description });
          }
        } catch (error: any) {
          results.push({ employee: employee.name, status: 'error', error: error.message });
        }
      }

      const successCount = results.filter(r => r.status === 'success').length;
      
      res.json({ 
        message: `Отправлено ${successCount} из ${employeesWithTelegram.length} сообщений`,
        results 
      });
    } catch (error: any) {
      console.error('Telegram broadcast error:', error);
      res.status(500).json({ 
        message: 'Ошибка рассылки',
        error: error.message 
      });
    }
  });

  app.patch('/api/employees/guest/telegram', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { telegramId } = req.body;
      if (!telegramId) {
        return res.status(400).json({ message: 'Telegram ID обязателен' });
      }

      const employees = await storage.getAllEmployees();
      const guestEmployee = employees.find(emp => emp.role === 'guest');
      
      if (!guestEmployee) {
        return res.status(404).json({ message: 'Гостевой аккаунт не найден' });
      }

      const updated = await storage.updateEmployee(guestEmployee.id, {
        telegramId: telegramId,
      });

      if (!updated) {
        return res.status(404).json({ message: 'Не удалось обновить гостевой аккаунт' });
      }

      res.json({ message: 'Telegram ID гостя успешно обновлен' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка обновления Telegram ID' });
    }
  });

  app.patch('/api/profile/update', requireAuth, async (req, res) => {
    try {
      const { name, color, frame, avatarUrl } = req.body;
      const userId = (req as any).user.id;

      const updated = await storage.updateEmployee(userId, {
        name,
        color,
        frame,
        avatarUrl,
      });

      if (!updated) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json({ message: 'Профиль успешно обновлен', user: updated });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка обновления профиля' });
    }
  });

  // Clean expired sessions periodically
  setInterval(async () => {
    await storage.cleanExpiredSessions();
  }, 60 * 60 * 1000); // Every hour

  const httpServer = createServer(app);
  return httpServer;
}
