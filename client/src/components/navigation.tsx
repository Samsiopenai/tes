import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Video, Calendar, Users, LogOut } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
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
    <nav className="bg-black/20 backdrop-blur-sm border-b border-purple-700/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-pink-500 p-2 rounded-lg">
              <Video className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold text-gradient">
              CAMERA TOON
            </h1>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className={`nav-link ${location === '/' ? 'active' : ''}`}
            >
              Главная
            </Link>
            <Link
              href="/calendar"
              className={`nav-link ${location === '/calendar' ? 'active' : ''}`}
            >
              Календарь
            </Link>
            <Link
              href="/employees"
              className={`nav-link ${location === '/employees' ? 'active' : ''}`}
            >
              Сотрудники
            </Link>
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`nav-link ${location === '/admin' ? 'active' : ''}`}
              >
                Телеграм Бот
              </Link>
            )}
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-purple-700/30 px-3 py-1 rounded-full">
                  <div className={`w-8 h-8 ${getColorClass(user.color)} rounded-full flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">{user.initials}</span>
                  </div>
                  <span className="text-sm">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:text-pink-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
