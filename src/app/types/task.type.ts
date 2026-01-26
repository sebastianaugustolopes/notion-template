export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskStatus = 'TODO' | 'PLANNING' | 'IN_PROGRESS' | 'DONE';

export interface TaskPriorityInfo {
  value: TaskPriority;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export interface TaskStatusInfo {
  value: TaskStatus;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  endDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskRequest {
  title: string;
  description: string;
  endDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export const TASK_PRIORITIES: (TaskPriorityInfo & { iconColor?: string; icon?: string })[] = [
  { value: 'LOW', label: 'Low', color: 'emerald', bgColor: 'bg-emerald-500', textColor: 'text-emerald-700', borderColor: 'border-emerald-200', iconColor: 'emerald' },
  { value: 'MEDIUM', label: 'Medium', color: 'amber', bgColor: 'bg-amber-500', textColor: 'text-amber-700', borderColor: 'border-amber-200', iconColor: 'amber' },
  { value: 'HIGH', label: 'High', color: 'red', bgColor: 'bg-red-500', textColor: 'text-red-700', borderColor: 'border-red-200', iconColor: 'red' },
];

export const TASK_STATUSES: (TaskStatusInfo & { iconColor?: string; icon?: string })[] = [
  { value: 'TODO', label: 'To Do', color: 'slate', bgColor: 'bg-slate-500', textColor: 'text-slate-700', borderColor: 'border-slate-200', iconColor: 'slate', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { value: 'PLANNING', label: 'Planning', color: 'purple', bgColor: 'bg-purple-500', textColor: 'text-purple-700', borderColor: 'border-purple-200', iconColor: 'indigo', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'blue', bgColor: 'bg-blue-500', textColor: 'text-blue-700', borderColor: 'border-blue-200', iconColor: 'blue', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { value: 'DONE', label: 'Done', color: 'emerald', bgColor: 'bg-emerald-500', textColor: 'text-emerald-700', borderColor: 'border-emerald-200', iconColor: 'emerald', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export function getTaskPriorityInfo(priority: TaskPriority): TaskPriorityInfo {
  return TASK_PRIORITIES.find(p => p.value === priority) ?? TASK_PRIORITIES[0];
}

export function getStatusInfo(status: TaskStatus): TaskStatusInfo {
  return TASK_STATUSES.find(s => s.value === status) ?? TASK_STATUSES[0];
}

export function isTaskCompleted(task: Task): boolean {
  return task.status === 'DONE';
}

// Task Statistics
export interface TaskStats {
  totalTasks: number;
  todoCount: number;
  planningCount: number;
  inProgressCount: number;
  doneCount: number;
  missedCount: number;
}

// Expired Task
export interface ExpiredTask {
  priority: any;
  id: string;
  title: string;
  description: string;
  endDate: string;
  status: TaskStatus;
  projectId: string;
  projectName: string;
  daysOverdue: number;
}

// Status stats for progress display
export interface StatusStat {
  status: TaskStatus | 'MISSED';
  label: string;
  count: number;
  percentage: number;
  bgColor: string;
  textColor: string;
  barColor: string;
  dotColor: string;
  icon: string;
}

export function calculateStatusStats(stats: TaskStats): StatusStat[] {
  const total = stats.totalTasks;

  return [
    {
      status: 'TODO',
      label: 'To Do',
      count: stats.todoCount,
      percentage: total > 0 ? (stats.todoCount / total) * 100 : 0,
      bgColor: 'bg-slate-100 dark:bg-neutral-800',
      textColor: 'text-slate-700',
      barColor: 'bg-slate-500',
      dotColor: 'bg-slate-500',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      status: 'PLANNING',
      label: 'Planning',
      count: stats.planningCount,
      percentage: total > 0 ? (stats.planningCount / total) * 100 : 0,
      bgColor: 'bg-slate-100 dark:bg-neutral-800',
      textColor: 'text-purple-700',
      barColor: 'bg-purple-500',
      dotColor: 'bg-purple-500',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    },
    {
      status: 'IN_PROGRESS',
      label: 'In Progress',
      count: stats.inProgressCount,
      percentage: total > 0 ? (stats.inProgressCount / total) * 100 : 0,
      bgColor: 'bg-slate-100 dark:bg-neutral-800',
      textColor: 'text-blue-700',
      barColor: 'bg-blue-500',
      dotColor: 'bg-blue-500',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    },
    {
      status: 'DONE',
      label: 'Completed',
      count: stats.doneCount,
      percentage: total > 0 ? (stats.doneCount / total) * 100 : 0,
      bgColor: 'bg-slate-100 dark:bg-neutral-800',
      textColor: 'text-emerald-700',
      barColor: 'bg-emerald-500',
      dotColor: 'bg-emerald-500',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      status: 'MISSED',
      label: 'Missed',
      count: stats.missedCount,
      percentage: total > 0 ? (stats.missedCount / total) * 100 : 0,
      bgColor: 'bg-slate-100 dark:bg-neutral-800',
      textColor: 'text-red-700',
      barColor: 'bg-red-500',
      dotColor: 'bg-red-500',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];
}
