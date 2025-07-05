import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Employee } from '@/types';

interface DecorativeAvatarProps {
  employee: Employee;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFrame?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const frameClasses = {
  sm: 'p-1',
  md: 'p-1.5',
  lg: 'p-2',
  xl: 'p-3'
};

export function DecorativeAvatar({ 
  employee, 
  size = 'md', 
  showFrame = true,
  onClick,
  className = '' 
}: DecorativeAvatarProps) {
  const getColorClass = (color: string) => {
    const colorMap = {
      pink: 'bg-pink-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getFrameColor = (color: string) => {
    const colorMap = {
      pink: 'from-pink-400 via-pink-500 to-pink-600',
      blue: 'from-blue-400 via-blue-500 to-blue-600',
      green: 'from-green-400 via-green-500 to-green-600',
      purple: 'from-purple-400 via-purple-500 to-purple-600',
    };
    return colorMap[color as keyof typeof colorMap] || 'from-gray-400 via-gray-500 to-gray-600';
  };

  const AvatarComponent = (
    <Avatar className={`${sizeClasses[size]} ${onClick ? 'cursor-pointer' : ''}`}>
      {employee.avatarUrl ? (
        <AvatarImage src={employee.avatarUrl} alt={employee.name} />
      ) : (
        <AvatarFallback className={`${getColorClass(employee.color)} text-white font-bold ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-xl'}`}>
          {employee.initials}
        </AvatarFallback>
      )}
    </Avatar>
  );

  if (!showFrame) {
    return (
      <div className={className} onClick={onClick}>
        {AvatarComponent}
      </div>
    );
  }

  return (
    <div 
      className={`relative ${frameClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Декоративная рамка */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getFrameColor(employee.color)} rounded-full`}>
        {/* Узорная рамка */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 2px, transparent 2px),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 2px, transparent 2px),
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 1px, transparent 1px),
            radial-gradient(circle at 50% 100%, rgba(255,255,255,0.2) 1px, transparent 1px),
            radial-gradient(circle at 0% 50%, rgba(255,255,255,0.2) 1px, transparent 1px),
            radial-gradient(circle at 100% 50%, rgba(255,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%'
        }} />
        
        {/* Внутренняя тень */}
        <div className="absolute inset-0 rounded-full shadow-inner opacity-50" 
             style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)' }} />
      </div>
      
      {/* Основной аватар */}
      <div className="relative z-10 bg-gray-900 rounded-full p-0.5">
        {AvatarComponent}
      </div>
      
      {/* Блеск поверх */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-40 z-20" />
    </div>
  );
}