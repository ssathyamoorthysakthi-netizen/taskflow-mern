import { CalendarClock, Eye, Pencil, Trash2, FolderKanban, User2 } from 'lucide-react';
import { PRIORITY_META, STATUS_META } from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/helpers';
import Badge from '../ui/Badge';

export default function TaskCard({ task, onView, onEdit, onDelete, onChangeStatus, showAssignee = false }) {
  const status = STATUS_META[task.status];
  const priority = PRIORITY_META[task.priority];
  const overdue = isOverdue(task);

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">{task.title}</h3>
        <Badge label={priority.label} className={priority.badge} />
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          <FolderKanban className="h-3.5 w-3.5" />
          {task.category}
        </span>
        <Badge label={status.label} className={status.badge} />
        {showAssignee && task.userId && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <User2 className="h-3.5 w-3.5" />
            {task.userId.name || 'Unassigned'}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <CalendarClock
          className={`h-4 w-4 ${overdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}
        />
        <span className={overdue ? 'font-semibold text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}>
          {overdue ? 'Overdue · ' : ''}
          {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        {onChangeStatus ? (
          <select
            value={task.status}
            onChange={(e) => onChangeStatus(task._id, e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-1">
          {onView && (
            <button
              onClick={() => onView(task)}
              title="View"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-primary-300"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              title="Edit"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              title="Delete"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}