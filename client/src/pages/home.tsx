import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Video } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { useEmployees } from '@/hooks/use-shifts';
import { EmployeeCard } from '@/components/employee-card';
import vladImage from '@assets/image_1751737664603.png';
import andreyImage from '@assets/image_1751737668535.png';
import kostyaImage from '@assets/image_1751737673571.png';

export default function Home() {
  const { employees } = useEmployees();

  const getEmployeeImage = (username: string) => {
    const imageMap = {
      vladshain: vladImage,
      andreykosting: andreyImage,
      kostyamolokov: kostyaImage,
    };
    return imageMap[username as keyof typeof imageMap];
  };

  return (
    <div className="min-h-screen gradient-bg text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-2xl mb-4">
              <Video className="text-white text-4xl" />
            </div>
            <h1 className="text-5xl font-bold mb-2 text-gradient">
              CAMERA TOON
            </h1>
            <p className="text-xl text-gray-300 mb-2">Творческая студия</p>
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              Управление командой и расписанием
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card-gradient p-8 rounded-2xl">
            <div className="text-center mb-6">
              <div className="inline-block bg-white/20 p-3 rounded-xl mb-4">
                <Calendar className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Планировщик работы</h3>
              <p className="text-gray-200">Управляйте расписанием съемок и рабочими сменами вашей команды</p>
            </div>
            <Link href="/calendar">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl">
                <Calendar className="mr-2 h-5 w-5" />
                Открыть календарь
              </Button>
            </Link>
          </div>

          <div className="card-gradient p-8 rounded-2xl">
            <div className="text-center mb-6">
              <div className="inline-block bg-white/20 p-3 rounded-xl mb-4">
                <Users className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Команда</h3>
              <p className="text-gray-200">Просматривайте профили сотрудников и управляйте ролями</p>
            </div>
            <Link href="/employees">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl">
                <Users className="mr-2 h-5 w-5" />
                Посмотреть команду
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {employees.slice(0, 3).map((employee) => {
            const image = getEmployeeImage(employee.username);
            return (
              <div key={employee.id} className={`${employee.color === 'pink' ? 'bg-pink-500/20 border-pink-500/30' : employee.color === 'blue' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-green-500/20 border-green-500/30'} p-6 rounded-xl border employee-card`}>
                <div className="flex items-center space-x-4">
                  {image ? (
                    <img 
                      src={image} 
                      alt={employee.name}
                      className={`w-12 h-12 rounded-full object-cover border-2 ${employee.color === 'pink' ? 'border-pink-500' : employee.color === 'blue' ? 'border-blue-500' : 'border-green-500'}`}
                    />
                  ) : (
                    <div className={`w-12 h-12 ${employee.color === 'pink' ? 'bg-pink-500' : employee.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold">{employee.initials}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{employee.name}</h4>
                    <p className="text-sm text-gray-300">
                      {employee.role === 'admin' ? 'Администратор' : 
                       employee.role === 'worker' ? 'Работник' : 'Гость'}
                    </p>
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
