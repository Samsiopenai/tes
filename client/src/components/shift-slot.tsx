import { useDrop } from 'react-dnd';
import { Sun, Moon } from 'lucide-react';
import { ItemTypes } from '@/lib/dnd';
import type { DraggedEmployee, Shift, Employee } from '@/types';

interface ShiftSlotProps {
  date: string;
  shiftType: 'day' | 'night';
  shift?: Shift;
  employee?: Employee;
  onAssignShift: (date: string, shiftType: 'day' | 'night', employeeId: number) => void;
  onRemoveShift: (shiftId: number) => void;
  canEdit: boolean;
}

export function ShiftSlot({
  date,
  shiftType,
  shift,
  employee,
  onAssignShift,
  onRemoveShift,
  canEdit,
}: ShiftSlotProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.EMPLOYEE,
    drop: (item: DraggedEmployee) => {
      if (canEdit) {
        onAssignShift(date, shiftType, item.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop() && canEdit,
    }),
  }));

  const getColorClass = (color: string) => {
    const colorMap = {
      pink: 'bg-pink-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getShiftBgClass = (shiftType: 'day' | 'night') => {
    return shiftType === 'day' 
      ? 'bg-yellow-500/20 border-yellow-500/30' 
      : 'bg-blue-500/20 border-blue-500/30';
  };

  const handleDoubleClick = () => {
    if (canEdit && shift) {
      onRemoveShift(shift.id);
    }
  };

  return (
    <div
      ref={drop}
      className={`
        shift-slot drop-zone 
        ${getShiftBgClass(shiftType)} 
        border rounded text-xs p-1 mb-1 flex-1 flex items-center justify-center
        ${isOver && canDrop ? 'drag-over' : ''}
        ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed'}
      `}
      onDoubleClick={handleDoubleClick}
      title={canEdit ? 'Перетащите сотрудника для назначения или дважды кликните для удаления' : 'Только просмотр'}
    >
      {employee ? (
        <div className={`w-6 h-6 ${getColorClass(employee.color)} rounded-full flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">{employee.initials}</span>
        </div>
      ) : (
        shiftType === 'day' ? (
          <Sun className="w-4 h-4 text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-blue-400" />
        )
      )}
    </div>
  );
}
