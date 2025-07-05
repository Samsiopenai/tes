import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Settings, User } from 'lucide-react';
import type { Employee } from '@shared/schema';

interface UserAvatarProps {
  employee: Employee;
}

export function UserAvatar({ employee }: UserAvatarProps) {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: employee.name,
    color: employee.color,
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Выход выполнен',
        description: 'Вы успешно вышли из системы',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выйти из системы',
        variant: 'destructive',
      });
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast({
        title: 'Профиль обновлен',
        description: 'Ваши изменения сохранены',
      });
      setIsProfileOpen(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive',
      });
    }
  };

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
    <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border-2 border-purple-700/30 hover:border-pink-500/50 transition-colors"
        >
          <Avatar className="h-9 w-9">
            {employee.avatarUrl ? (
              <AvatarImage src={employee.avatarUrl} alt={employee.name} />
            ) : (
              <AvatarFallback className={`${getColorClass(employee.color)} text-white text-sm font-bold`}>
                {employee.initials}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black/90 backdrop-blur-sm border-purple-700/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Профиль пользователя
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {employee.avatarUrl ? (
                <AvatarImage src={employee.avatarUrl} alt={employee.name} />
              ) : (
                <AvatarFallback className={`${getColorClass(profileData.color)} text-white text-lg font-bold`}>
                  {employee.initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{employee.name}</h3>
              <p className="text-sm text-gray-400">@{employee.username}</p>
              <p className="text-sm text-gray-400 capitalize">{employee.role}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-black/20 border-purple-700/30 text-white"
              />
            </div>

            <div>
              <Label htmlFor="color">Цвет аватара</Label>
              <select
                id="color"
                value={profileData.color}
                onChange={(e) => setProfileData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full p-2 rounded-md bg-black/20 border border-purple-700/30 text-white"
              >
                <option value="pink">Розовый</option>
                <option value="blue">Синий</option>
                <option value="green">Зеленый</option>
                <option value="purple">Фиолетовый</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleProfileUpdate}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1 border-red-600/30 text-red-400 hover:bg-red-600/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}