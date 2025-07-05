import type { DraggedEmployee } from '@/types';

export interface DragDropItem {
  type: 'employee';
  employee: DraggedEmployee;
}

export interface DropResult {
  date: string;
  shiftType: 'day' | 'night';
}

export const ItemTypes = {
  EMPLOYEE: 'employee',
} as const;
