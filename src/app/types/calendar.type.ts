import { TaskPriority, TaskStatus } from './task.type';

export interface CalendarTask {
  id: string;
  title: string;
  description: string;
  endDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: string;
  projectName: string;
  projectType: string;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  tasks: CalendarTask[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}

export function getProjectTypeColor(projectType: string): { bg: string; text: string; border: string } {
  switch (projectType) {
    case 'WORK':
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    case 'PERSONAL':
      return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
    case 'STUDY':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    case 'OTHER':
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function getStatusColor(status: TaskStatus): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'TODO':
      return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };
    case 'PLANNING':
      return { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' };
    case 'IN_PROGRESS':
      return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
    case 'DONE':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };
  }
}

export function getPriorityColor(priority: TaskPriority): { bg: string; text: string } {
  switch (priority) {
    case 'HIGH':
      return { bg: 'bg-red-100', text: 'text-red-700' };
    case 'MEDIUM':
      return { bg: 'bg-amber-100', text: 'text-amber-700' };
    case 'LOW':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700' };
  }
}
