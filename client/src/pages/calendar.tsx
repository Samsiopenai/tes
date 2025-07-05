import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Navigation } from '@/components/navigation';
import { CalendarGrid } from '@/components/calendar-grid';
import { EmployeeSidebar } from '@/components/employee-sidebar';

export default function Calendar() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen gradient-bg text-white">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <EmployeeSidebar />
            <CalendarGrid />
          </div>
        </main>
      </div>
    </DndProvider>
  );
}
