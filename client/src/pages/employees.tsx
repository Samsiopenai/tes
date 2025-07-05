import { Navigation } from '@/components/navigation';
import { EmployeeCard } from '@/components/employee-card';
import { useEmployees } from '@/hooks/use-shifts';
import { Users } from 'lucide-react';
import vladImage from '@assets/image_1751737664603.png';
import andreyImage from '@assets/image_1751737668535.png';
import kostyaImage from '@assets/image_1751737673571.png';

export default function Employees() {
  const { employees, isLoading, error } = useEmployees();

  const getEmployeeImage = (username: string) => {
    const imageMap = {
      vladshain: vladImage,
      andreykosting: andreyImage,
      kostyamolokov: kostyaImage,
    };
    return imageMap[username as keyof typeof imageMap];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg text-white">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg text-white">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <Users className="h-12 w-12 mx-auto mb-2" />
              <p>Ошибка загрузки сотрудников</p>
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
          <h2 className="text-3xl font-bold mb-4">Команда CAMERA TOON</h2>
          <p className="text-gray-300">Познакомьтесь с нашей творческой командой</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((employee) => {
            const image = getEmployeeImage(employee.username);
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
                pink: 'bg-pink-500 border-pink-500',
                blue: 'bg-blue-500 border-blue-500',
                green: 'bg-green-500 border-green-500',
                purple: 'bg-purple-500 border-purple-500',
              };
              return colorMap[color as keyof typeof colorMap] || 'bg-gray-500 border-gray-500';
            };

            const getTextColorClass = (color: string) => {
              const colorMap = {
                pink: 'text-pink-400',
                blue: 'text-blue-400',
                green: 'text-green-400',
                purple: 'text-purple-400',
              };
              return colorMap[color as keyof typeof colorMap] || 'text-gray-400';
            };

            const getRoleText = (role: string) => {
              const roleMap = {
                admin: 'Администратор',
                worker: 'Работник',
                guest: 'Гость',
              };
              return roleMap[role as keyof typeof roleMap] || role;
            };

            return (
              <div key={employee.id} className={`employee-card ${getColorClass(employee.color)} p-6 rounded-xl border`}>
                <div className="text-center mb-4">
                  {image ? (
                    <img 
                      src={image} 
                      alt={employee.name}
                      className={`w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 ${getAvatarColorClass(employee.color)}`}
                    />
                  ) : (
                    <div className={`w-24 h-24 ${getAvatarColorClass(employee.color)} rounded-full mx-auto mb-4 flex items-center justify-center border-4`}>
                      <span className="text-white font-bold text-2xl">{employee.initials}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold">{employee.name}</h3>
                  <p className={`${getTextColorClass(employee.color)} font-semibold`}>{getRoleText(employee.role)}</p>
                </div>
                
                <div className="space-y-3">
                  {employee.role === 'admin' && (
                    <>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${getTextColorClass(employee.color)}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM17 4a1 1 0 10-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z" />
                        </svg>
                        <span className="text-sm">Полные права доступа</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${getTextColorClass(employee.color)}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Управление всеми сменами</span>
                      </div>
                    </>
                  )}
                  
                  {employee.role === 'worker' && (
                    <>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${getTextColorClass(employee.color)}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        <span className="text-sm">Создание и изменение смен</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${getTextColorClass(employee.color)}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Полный доступ к календарю</span>
                      </div>
                    </>
                  )}
                  
                  {employee.role === 'guest' && (
                    <>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${getTextColorClass(employee.color)}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Только просмотр</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${getTextColorClass(employee.color)}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Календарь в режиме чтения</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${getTextColorClass(employee.color)}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Нет прав на изменения</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <svg className={`w-4 h-4 ${getTextColorClass(employee.color)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">
                      {employee.role === 'guest' ? 'Без уведомлений' : 'Уведомления в Telegram'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
