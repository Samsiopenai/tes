import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { useEmployees } from '@/hooks/use-shifts';
import { DecorativeAvatar } from './decorative-avatar';
import { TelegramDialog } from './telegram-dialog';
import { 
  MessageCircle, 
  Settings, 
  Users, 
  Bell, 
  Archive, 
  Bookmark, 
  X, 
  Upload,
  Camera,
  Edit3
} from 'lucide-react';
import type { Employee } from '@/types';

interface TelegramAccountPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActiveTab = 'chats' | 'settings' | 'users' | 'notifications' | 'archive' | 'bookmarks';

export function TelegramAccountPanel({ isOpen, onClose }: TelegramAccountPanelProps) {
  const { user, updateProfile } = useAuth();
  const { data: employees = [] } = useEmployees();
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string;
        updateProfile({ avatarUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSave = () => {
    if (user?.role === 'admin' || user?.role === 'worker') {
      updateProfile({ name: newName });
    }
    setEditingName(false);
  };

  const sidebarItems = [
    { id: 'chats', icon: MessageCircle, label: 'Чаты', count: employees.length },
    { id: 'users', icon: Users, label: 'Сотрудники', count: employees.length },
    { id: 'archive', icon: Archive, label: 'Архив', count: 0 },
    { id: 'bookmarks', icon: Bookmark, label: 'Избранное', count: 0 },
    { id: 'notifications', icon: Bell, label: 'Уведомления', count: 0 },
    { id: 'settings', icon: Settings, label: 'Настройки', count: 0 },
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <div className="flex-1 p-4">
            <h2 className="text-xl font-bold text-white mb-4">Чаты</h2>
            <div className="space-y-2">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <DecorativeAvatar employee={employee} size="md" showFrame={true} />
                  <div className="flex-1">
                    <p className="font-medium text-white">{employee.name}</p>
                    <p className="text-sm text-gray-400">
                      {employee.role === 'admin' ? 'Администратор' : 
                       employee.role === 'worker' ? 'Работник' : 'Гость'}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {employee.id === user?.id && <span className="text-purple-400">Вы</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="flex-1 p-4">
            <h2 className="text-xl font-bold text-white mb-4">Сотрудники</h2>
            <div className="grid grid-cols-1 gap-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <DecorativeAvatar employee={employee} size="lg" showFrame={true} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{employee.name}</h3>
                      <p className="text-sm text-gray-400">
                        {employee.role === 'admin' ? 'Администратор' : 
                         employee.role === 'worker' ? 'Работник' : 'Гость'}
                      </p>
                      {employee.telegramId && (
                        <p className="text-xs text-purple-400 mt-1">
                          Telegram ID: {employee.telegramId}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEmployeeClick(employee)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 p-4">
            <h2 className="text-xl font-bold text-white mb-4">Настройки профиля</h2>
            <div className="space-y-6">
              {/* Аватар */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <DecorativeAvatar employee={user!} size="xl" showFrame={true} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Аватар</h3>
                    <p className="text-sm text-gray-400">Измените фотографию профиля</p>
                    <div className="flex gap-2 mt-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button size="sm" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                          <Upload className="h-4 w-4 mr-2" />
                          Загрузить
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Имя */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Имя</h3>
                    <p className="text-sm text-gray-400">
                      {user?.role === 'guest' ? 'Только администратор может изменить имя гостя' : 'Ваше отображаемое имя'}
                    </p>
                  </div>
                  {user?.role !== 'guest' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingName(true)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {editingName && user?.role !== 'guest' ? (
                  <div className="flex gap-2 mt-3">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="Введите новое имя"
                    />
                    <Button
                      onClick={handleNameSave}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Сохранить
                    </Button>
                  </div>
                ) : (
                  <p className="text-white mt-2">{user?.name}</p>
                )}
              </div>

              {/* Роль */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-white">Роль</h3>
                <p className="text-sm text-gray-400">Ваша роль в системе</p>
                <p className="text-purple-400 mt-2 font-medium">
                  {user?.role === 'admin' ? 'Администратор' : 
                   user?.role === 'worker' ? 'Работник' : 'Гость'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">Раздел в разработке</p>
              <p className="text-sm mt-2">Эта функция скоро будет доступна</p>
            </div>
          </div>
        );
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] mx-4 flex overflow-hidden">
          {/* Боковая панель */}
          <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
            {sidebarItems.map((item) => (
              <div key={item.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-12 h-12 p-0 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
                {item.count > 0 && (
                  <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.count}
                  </div>
                )}
              </div>
            ))}
            
            {/* Кнопка закрытия */}
            <div className="mt-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-12 h-12 p-0 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Основной контент */}
          <div className="flex-1 bg-gray-900 flex flex-col">
            {renderMainContent()}
          </div>
        </div>
      </div>

      {/* Диалог */}
      {selectedEmployee && (
        <TelegramDialog
          employee={selectedEmployee}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </>
  );
}