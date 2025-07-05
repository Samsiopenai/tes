import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      await login({ username, password });
      toast({
        title: 'Добро пожаловать!',
        description: 'Вы успешно вошли в систему',
      });
    } catch (error) {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный логин или пароль',
        variant: 'destructive',
      });
    }
  };

  const demoAccounts = [
    { username: 'vladshain', name: 'Влад Шайн', role: 'Администратор' },
    { username: 'kostyamolokov', name: 'Костя Молоков', role: 'Работник' },
    { username: 'andreykosting', name: 'Андрей Костин', role: 'Работник' },
    { username: 'liya', name: 'Лия', role: 'Гость' },
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-2xl mb-4">
            <Video className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            CAMERA TOON
          </h1>
          <p className="text-gray-300">Творческая студия</p>
        </div>

        {/* Login Form */}
        <Card className="bg-black/20 backdrop-blur-sm border-purple-700/30">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Вход в систему</CardTitle>
            <CardDescription className="text-gray-300">
              Введите свои учетные данные для доступа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Логин</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Введите логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/20 border-purple-700/30 text-white placeholder-gray-400"
                  disabled={isLoggingIn}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/20 border-purple-700/30 text-white placeholder-gray-400 pr-10"
                    disabled={isLoggingIn}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-black/20 backdrop-blur-sm border-purple-700/30">
          <CardHeader>
            <CardTitle className="text-white text-sm">Демо-аккаунты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <div
                  key={account.username}
                  className="flex items-center justify-between p-2 rounded bg-purple-800/20 border border-purple-700/30"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{account.name}</p>
                    <p className="text-gray-400 text-xs">{account.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pink-400 hover:text-pink-300"
                    onClick={() => {
                      setUsername(account.username);
                      setPassword('password123');
                    }}
                  >
                    Выбрать
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Пароль для всех аккаунтов: password123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
