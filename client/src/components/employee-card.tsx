import type { Employee } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeeCardProps {
  employee: Employee;
  variant?: 'compact' | 'full';
  className?: string;
}

export function EmployeeCard({ employee, variant = 'compact', className = '' }: EmployeeCardProps) {
  const getColorClass = (color: string) => {
    const colorMap = {
      pink: 'bg-pink-500/20 border-pink-500/30',
      blue: 'bg-blue-500/20 border-blue-500/30',
      green: 'bg-green-500/20 border-green-500/30',
      purple: 'bg-purple-500/20 border-purple-500/30',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500/20 border-gray-500/30';
  };

  const getAvatarColorClass = (color: string) => {
    const colorMap = {
      pink: 'bg-pink-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getRoleText = (role: string) => {
    const roleMap = {
      admin: 'Администратор',
      worker: 'Работник',
      guest: 'Гость',
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  if (variant === 'compact') {
    return (
      <div className={`employee-card ${getColorClass(employee.color)} p-4 rounded-lg border ${className}`}>
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            {employee.avatarUrl ? (
              <AvatarImage src={employee.avatarUrl} alt={employee.name} />
            ) : (
              <AvatarFallback className={`${getAvatarColorClass(employee.color)} text-white font-bold text-sm`}>
                {employee.initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-semibold">{employee.name}</p>
            <p className="text-xs text-gray-400">{getRoleText(employee.role)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`employee-card ${getColorClass(employee.color)} p-6 rounded-xl border ${className}`}>
      <div className="text-center mb-4">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-purple-500">
          {employee.avatarUrl ? (
            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
          ) : (
            <AvatarFallback className={`${getAvatarColorClass(employee.color)} text-white font-bold text-2xl`}>
              {employee.initials}
            </AvatarFallback>
          )}
        </Avatar>
        <h3 className="text-xl font-bold">{employee.name}</h3>
        <p className={`text-${employee.color}-400 font-semibold`}>{getRoleText(employee.role)}</p>
      </div>
      
      <div className="space-y-3">
        {employee.role === 'admin' && (
          <>
            <div className="flex items-center gap-2">
              <i className={`fas fa-crown text-${employee.color}-400`}></i>
              <span className="text-sm">Полные права доступа</span>
            </div>
            <div className="flex items-center gap-2">
              <i className={`fas fa-calendar text-${employee.color}-400`}></i>
              <span className="text-sm">Управление всеми сменами</span>
            </div>
          </>
        )}
        
        {employee.role === 'worker' && (
          <>
            <div className="flex items-center gap-2">
              <i className={`fas fa-edit text-${employee.color}-400`}></i>
              <span className="text-sm">Создание и изменение смен</span>
            </div>
            <div className="flex items-center gap-2">
              <i className={`fas fa-calendar text-${employee.color}-400`}></i>
              <span className="text-sm">Полный доступ к календарю</span>
            </div>
          </>
        )}
        
        {employee.role === 'guest' && (
          <>
            <div className="flex items-center gap-2">
              <i className={`fas fa-eye text-${employee.color}-400`}></i>
              <span className="text-sm">Только просмотр</span>
            </div>
            <div className="flex items-center gap-2">
              <i className={`fas fa-calendar text-${employee.color}-400`}></i>
              <span className="text-sm">Календарь в режиме чтения</span>
            </div>
            <div className="flex items-center gap-2">
              <i className={`fas fa-ban text-${employee.color}-400`}></i>
              <span className="text-sm">Нет прав на изменения</span>
            </div>
          </>
        )}
        
        <div className="flex items-center gap-2">
          <i className={`fas fa-telegram text-${employee.color}-400`}></i>
          <span className="text-sm">
            {employee.role === 'guest' ? 'Без уведомлений' : 'Уведомления в Telegram'}
          </span>
        </div>
      </div>
    </div>
  );
}
