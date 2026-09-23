import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { PRIORITY_META, STATUS_META } from '../../utils/constants';
import { formatDateTime, isOverdue } from '../../utils/helpers';
import { FolderKanban, UserCheck } from 'lucide-react';

export default function TaskDetail({ task, open, onClose }) {
  if (!task) return null;

  const status = STATUS_META[task.status];
  const priority = PRIORITY_META[task.priority];
  const overdue = isOverdue(task);

  const Row = ({ label, value }) => (
    <div className="flex items-start justify-between py-3">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="Task Details" maxWidth="max-w-xl">
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{task.title}</h4>
          <Badge label={priority.label} className={priority.badge} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge label={status.label} className={status.badge} />
          <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
            <FolderKanban className="h-3.5 w-3.5" /> {task.category}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
        <p className="rounded-xl bg-white p-4 text-sm leading-relaxed text-gray-700 shadow-card dark:bg-gray-800 dark:text-gray-300">
          {task.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-700">
        <Row
          label="Due date"
          value={
            <span className={overdue ? 'text-red-600 dark:text-red-400' : ''}>
              {formatDateTime(task.dueDate)}
            </span>
          }
        />
        <Row label="Created" value={formatDateTime(task.createdAt)} />
        <Row label="Last updated" value={formatDateTime(task.updatedAt)} />
        <Row
          label="Assigned to"
          value={
            task.userId ? (
              <span className="flex items-center gap-2">
                <Avatar user={task.userId} size="sm" />
                <span>
                  {task.userId.name}
                  <span className="ml-1 text-xs font-normal text-gray-400">({task.userId.email})</span>
                </span>
              </span>
            ) : (
              'Unassigned'
            )
          }
        />
        {task.assignedBy && (
          <Row
            label="Assigned by"
            value={
              <span className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                {task.assignedBy.name}
              </span>
            }
          />
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="btn-secondary">Close</button>
      </div>
    </Modal>
  );
}