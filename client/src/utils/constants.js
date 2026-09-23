export const CATEGORIES = ['Development', 'Design', 'Testing', 'Documentation', 'Meeting', 'Other'];

export const PRIORITIES = ['low', 'medium', 'high'];

export const STATUSES = ['todo', 'in-progress', 'completed'];

export const STATUS_META = {
  todo: { label: 'Todo', badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200', dot: 'bg-gray-400' },
  'in-progress': {
    label: 'In Progress',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    dot: 'bg-blue-500',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    dot: 'bg-green-500',
  },
};

export const PRIORITY_META = {
  low: {
    label: 'Low',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    dot: 'bg-green-500',
  },
  medium: {
    label: 'Medium',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    dot: 'bg-yellow-500',
  },
  high: {
    label: 'High',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    dot: 'bg-red-500',
  },
};

export const CHART_COLORS = {
  todo: '#9ca3af',
  'in-progress': '#3b82f6',
  completed: '#22c55e',
  low: '#22c55e',
  medium: '#eab308',
  high: '#ef4444',
  Development: '#6366f1',
  Design: '#ec4899',
  Testing: '#f59e0b',
  Documentation: '#0ea5e9',
  Meeting: '#8b5cf6',
  Other: '#6b7280',
};

export const DEFAULT_AVATAR_COLORS = [
  'bg-primary-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-pink-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-rose-500',
];