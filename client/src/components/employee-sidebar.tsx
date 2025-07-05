import { useDrag } from 'react-dnd';
import { EmployeeCard } from './employee-card';
import { useEmployees } from '@/hooks/use-shifts';
import { ItemTypes } from '@/lib/dnd';
import type { Employee } from '@/types';
import { Sun, Moon } from 'lucide-react';

interface DraggableEmployeeProps {
  employee: Employee;
}

function DraggableEmployee({ employee }: DraggableEmployeeProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EMPLOYEE,
    item: {
      id: employee.id,
      name: employee.name,
      initials: employee.initials,
      color: employee.color,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`draggable cursor-grab ${isDragging ? 'opacity-50' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <EmployeeCard employee={employee} variant="compact" />
    </div>
  );
}

export function EmployeeSidebar() {
  const { employees, isLoading, error } = useEmployees();

  if (isLoading) {
    return (
      <div className="w-64 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-purple-700/30">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-purple-700/30">
        <div className="text-red-400 text-center">
          <p>Ошибка загрузки сотрудников</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-purple-700/30">
      <h3 className="text-lg font-semibold mb-4">Сотрудники</h3>
      <div className="space-y-3">
        {employees.filter(emp => emp.role !== 'guest').map((employee) => (
          <DraggableEmployee key={employee.id} employee={employee} />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-purple-700/30">
        <h4 className="text-sm font-semibold mb-2">Легенда</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Sun className="w-3 h-3 text-yellow-400" />
            <span>Дневная смена</span>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="w-3 h-3 text-blue-400" />
            <span>Ночная смена</span>
          </div>
        </div>
      </div>
    </div>
  );
}
