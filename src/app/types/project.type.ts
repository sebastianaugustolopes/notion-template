export type ProjectType = 'WORK' | 'SCHOOL' | 'PERSONAL' | 'FINANCIAL' | 'FAMILY';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface PriorityInfo {
  value: Priority;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: ProjectType;
  priority: Priority;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: ProjectType;
  priority: Priority;
}

export const PROJECT_TYPES: { value: ProjectType; label: string; icon: string; iconColor: string }[] = [
  { value: 'WORK', label: 'Work', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', iconColor: 'blue' },
  { value: 'SCHOOL', label: 'School', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', iconColor: 'indigo' },
  { value: 'PERSONAL', label: 'Personal', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', iconColor: 'violet' },
  { value: 'FINANCIAL', label: 'Financial', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', iconColor: 'lime' },
  { value: 'FAMILY', label: 'Family', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', iconColor: 'emerald' },
];

export const PRIORITIES: (PriorityInfo & { iconColor?: string; icon?: string })[] = [
  { value: 'LOW', label: 'Low', color: 'emerald', bgColor: 'bg-emerald-500', textColor: 'text-emerald-700', borderColor: 'border-emerald-200', iconColor: 'emerald' },
  { value: 'MEDIUM', label: 'Medium', color: 'amber', bgColor: 'bg-amber-500', textColor: 'text-amber-700', borderColor: 'border-amber-200', iconColor: 'amber' },
  { value: 'HIGH', label: 'High', color: 'red', bgColor: 'bg-red-500', textColor: 'text-red-700', borderColor: 'border-red-200', iconColor: 'red' },
  { value: 'URGENT', label: 'Urgent', color: 'red', bgColor: 'bg-red-500', textColor: 'text-red-700', borderColor: 'border-red-200', iconColor: 'rose' },
];

export function getPriorityInfo(priority: Priority): PriorityInfo {
  return PRIORITIES.find(p => p.value === priority) ?? PRIORITIES[0];
}

export function getProjectTypeInfo(type: ProjectType) {
  return PROJECT_TYPES.find(t => t.value === type) ?? PROJECT_TYPES[0];
}
