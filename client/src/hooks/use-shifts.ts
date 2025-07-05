import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Shift } from '@/types';

export function useShifts(year: number, month: number) {
  const queryClient = useQueryClient();

  const { data: shifts = [], isLoading, error } = useQuery<Shift[]>({
    queryKey: ['/api/shifts', year, month],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shifts/${year}/${month}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch shifts');
      }
      
      return response.json();
    },
  });

  const createShiftMutation = useMutation({
    mutationFn: async (shiftData: { date: string; shiftType: string; employeeId: number }) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(shiftData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create shift');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shifts', year, month] });
    },
  });

  const deleteShiftMutation = useMutation({
    mutationFn: async (shiftId: number) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shifts/${shiftId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete shift');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shifts', year, month] });
    },
  });

  return {
    shifts,
    isLoading,
    error,
    createShift: createShiftMutation.mutateAsync,
    deleteShift: deleteShiftMutation.mutateAsync,
    isCreatingShift: createShiftMutation.isPending,
    isDeletingShift: deleteShiftMutation.isPending,
  };
}

export function useEmployees() {
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['/api/employees'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      return response.json();
    },
  });

  return {
    employees,
    isLoading,
    error,
  };
}
