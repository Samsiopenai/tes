import { useState } from 'react';
import { ShiftSlot } from './shift-slot';
import { useShifts, useEmployees } from '@/hooks/use-shifts';
import { useAuth } from '@/hooks/use-auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DAYS_OF_WEEK = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useAuth();
  const { toast } = useToast();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  
  const { shifts, createShift, deleteShift, isCreatingShift, isDeletingShift } = useShifts(year, month);
  const { employees } = useEmployees();
  
  const canEdit = user?.role === 'admin' || user?.role === 'worker';

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleAssignShift = async (date: string, shiftType: 'day' | 'night', employeeId: number) => {
    if (!canEdit) return;
    
    try {
      await createShift({
        date,
        shiftType,
        employeeId,
      });
      toast({
        title: 'Смена назначена',
        description: 'Сотрудник успешно назначен на смену',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось назначить смену',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveShift = async (shiftId: number) => {
    if (!canEdit) return;
    
    try {
      await deleteShift(shiftId);
      toast({
        title: 'Смена удалена',
        description: 'Назначение смены успешно удалено',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить смену',
        variant: 'destructive',
      });
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month - 1;
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isToday = isCurrentMonth && today.getDate() === day;
      
      const dayShifts = shifts.filter(shift => shift.date === dateString);
      const dayShift = dayShifts.find(shift => shift.shiftType === 'day');
      const nightShift = dayShifts.find(shift => shift.shiftType === 'night');
      
      const dayEmployee = dayShift ? employees.find(emp => emp.id === dayShift.employeeId) : undefined;
      const nightEmployee = nightShift ? employees.find(emp => emp.id === nightShift.employeeId) : undefined;
      
      days.push(
        <div
          key={day}
          className={`
            bg-black/20 backdrop-blur-sm border border-purple-700/30 rounded-lg p-2 h-24 flex flex-col
            ${isToday ? 'bg-purple-600/30 border-purple-500' : ''}
          `}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-purple-300' : ''}`}>
            {day}
          </div>
          
          <ShiftSlot
            date={dateString}
            shiftType="day"
            shift={dayShift}
            employee={dayEmployee}
            onAssignShift={handleAssignShift}
            onRemoveShift={handleRemoveShift}
            canEdit={canEdit}
          />
          
          <ShiftSlot
            date={dateString}
            shiftType="night"
            shift={nightShift}
            employee={nightEmployee}
            onAssignShift={handleAssignShift}
            onRemoveShift={handleRemoveShift}
            canEdit={canEdit}
          />
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Календарь работы</h2>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            disabled={isCreatingShift || isDeletingShift}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xl font-semibold min-w-[140px] text-center">
            {MONTHS[month - 1]} {year}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            disabled={isCreatingShift || isDeletingShift}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-400 p-3">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
      
      {!canEdit && (
        <div className="mt-4 text-center text-sm text-gray-400">
          У вас нет прав для изменения расписания
        </div>
      )}
    </div>
  );
}
