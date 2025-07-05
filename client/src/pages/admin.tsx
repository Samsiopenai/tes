import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useEmployees } from '@/hooks/use-shifts';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Users, Settings, CheckCircle, XCircle } from 'lucide-react';


export default function Admin() {
  const { user } = useAuth();
  const { employees, isLoading } = useEmployees();
  const { toast } = useToast();
  const [testMessage, setTestMessage] = useState('');
  const [isTestingBot, setIsTestingBot] = useState(false);
  const [botStatus, setBotStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [guestTelegramId, setGuestTelegramId] = useState('');

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen gradient-bg text-white">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Доступ запрещен</h2>
            <p className="text-gray-300">У вас нет прав для доступа к админ-панели</p>
          </div>
        </main>
      </div>
    );
  }

  const handleTestBot = async () => {
    if (!testMessage.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите сообщение для отправки',
        variant: 'destructive',
      });
      return;
    }

    setIsTestingBot(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: testMessage,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка сервера');
      }

      const result = await response.json();
      setBotStatus('connected');
      toast({
        title: 'Тест успешен!',
        description: result.message || 'Telegram бот работает корректно',
      });
    } catch (error: any) {
      setBotStatus('error');
      toast({
        title: 'Ошибка бота',
        description: error.message || 'Не удалось подключиться к Telegram боту',
        variant: 'destructive',
      });
    } finally {
      setIsTestingBot(false);
    }
  };

  const handleSendToAll = async () => {
    if (!testMessage.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите сообщение для отправки',
        variant: 'destructive',
      });
      return;
    }

    setIsTestingBot(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/telegram/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: testMessage,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка сервера');
      }

      const result = await response.json();
      toast({
        title: 'Сообщение отправлено!',
        description: result.message || 'Уведомление отправлено всей команде',
      });
      setTestMessage('');
    } catch (error: any) {
      toast({
        title: 'Ошибка отправки',
        description: error.message || 'Не удалось отправить сообщение команде',
        variant: 'destructive',
      });
    } finally {
      setIsTestingBot(false);
    }
  };

  const handleUpdateGuestTelegramId = async () => {
    if (!guestTelegramId.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите Telegram ID для гостя',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees/guest/telegram', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          telegramId: guestTelegramId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка сервера');
      }

      toast({
        title: 'Успешно!',
        description: 'Telegram ID гостя обновлен',
      });
      setGuestTelegramId('');
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось обновить Telegram ID',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = () => {
    switch (botStatus) {
      case 'connected':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Подключен</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Ошибка</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Не проверен</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg text-white">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-300 rounded-xl"></div>
              <div className="h-64 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Settings className="h-8 w-8 text-pink-500" />
            Админ-панель
          </h2>
          <p className="text-gray-300">Управление Telegram ботом и уведомлениями</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Telegram Bot Status */}
          <Card className="bg-black/20 backdrop-blur-sm border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-pink-500" />
                Telegram Бот
              </CardTitle>
              <CardDescription className="text-gray-300 flex items-center gap-2">
                Статус: {getStatusBadge()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-800/20 p-4 rounded-lg border border-purple-700/30">
                <h4 className="font-semibold mb-2">@CAMERA_TOON_BOT</h4>
                <p className="text-sm text-gray-300 mb-2">Бот для уведомлений о сменах</p>
                <code className="text-xs bg-black/30 px-2 py-1 rounded text-green-400">
                  Token: 7679093791:AAE...5ww
                </code>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-message" className="text-white">Тестовое сообщение</Label>
                <Input
                  id="test-message"
                  placeholder="Введите сообщение для теста..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="bg-black/20 border-purple-700/30 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleTestBot}
                  disabled={isTestingBot}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {isTestingBot ? 'Тестирование...' : 'Тест бота'}
                </Button>
                <Button
                  onClick={handleSendToAll}
                  disabled={isTestingBot}
                  variant="outline"
                  className="flex-1 border-purple-700/30 text-white hover:bg-purple-700/20"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Всем
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Telegram Status */}
          <Card className="bg-black/20 backdrop-blur-sm border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Команда в Telegram
              </CardTitle>
              <CardDescription className="text-gray-300">
                Настроенные Telegram ID участников
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((employee: any) => {
                  const getColorClass = (color: string) => {
                    const colorMap = {
                      pink: 'bg-pink-500',
                      blue: 'bg-blue-500',
                      green: 'bg-green-500',
                      purple: 'bg-purple-500',
                    };
                    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
                  };

                  return (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 bg-purple-800/20 rounded-lg border border-purple-700/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${getColorClass(employee.color)} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{employee.initials}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{employee.name}</p>
                          <p className="text-xs text-gray-400">
                            {employee.role === 'admin' ? 'Администратор' : 
                             employee.role === 'worker' ? 'Работник' : 'Гость'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {employee.telegramId ? (
                          <div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Настроен
                            </Badge>
                            <p className="text-xs text-gray-400">ID: {employee.telegramId}</p>
                          </div>
                        ) : employee.role === 'guest' ? (
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-1">
                              <XCircle className="w-3 h-3 mr-1" />
                              Не настроен
                            </Badge>
                            <div className="flex gap-1">
                              <Input
                                placeholder="Telegram ID"
                                value={guestTelegramId}
                                onChange={(e) => setGuestTelegramId(e.target.value)}
                                className="bg-black/20 border-purple-700/30 text-white text-xs h-6 w-24"
                              />
                              <Button
                                size="sm"
                                onClick={handleUpdateGuestTelegramId}
                                className="bg-green-600 hover:bg-green-700 h-6 px-2 text-xs"
                              >
                                ✓
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            <XCircle className="w-3 h-3 mr-1" />
                            Не настроен
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Bot Commands Help */}
        <Card className="bg-black/20 backdrop-blur-sm border-purple-700/30">
          <CardHeader>
            <CardTitle className="text-white">Команды бота</CardTitle>
            <CardDescription className="text-gray-300">
              Доступные команды для @CAMERA_TOON_BOT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-purple-800/20 p-3 rounded border border-purple-700/30">
                  <code className="text-pink-400">/start</code>
                  <p className="text-sm text-gray-300 mt-1">Активация бота и регистрация</p>
                </div>
                <div className="bg-purple-800/20 p-3 rounded border border-purple-700/30">
                  <code className="text-pink-400">/today</code>
                  <p className="text-sm text-gray-300 mt-1">Смены на сегодня</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-800/20 p-3 rounded border border-purple-700/30">
                  <code className="text-pink-400">/week</code>
                  <p className="text-sm text-gray-300 mt-1">Расписание на неделю</p>
                </div>
                <div className="bg-purple-800/20 p-3 rounded border border-purple-700/30">
                  <code className="text-pink-400">/help</code>
                  <p className="text-sm text-gray-300 mt-1">Справка по командам</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}