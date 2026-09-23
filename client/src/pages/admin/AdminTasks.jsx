import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListTodo, Search, PlusCircle, Eye, Pencil, Trash2, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { adminService, taskService } from '../../services/apiService';
import { getErrorMessage, showToast } from '../../utils/helpers';
import { CATEGORIES, PRIORITIES, STATUSES, PRIORITY_META, STATUS_META } from '../../utils/constants';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import TaskDetail from '../../components/tasks/TaskDetail';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '', sort: '' });
  const [page, setPage] = useState(1);
  const [viewTask, setViewTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.category) params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;
      const res = await adminService.getTasks(params);
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const applyFilters = () => {
    setPage(1);
    fetchTasks();
  };

  const resetFilters = () => {
    setFilters({ search: '', status: '', priority: '', category: '', sort: '' });
    setPage(1);
    fetchTasks();
  };

  const doChangeStatus = async (task, status) => {
    try {
      await taskService.updateTask(task._id, { status });
      showToast.success('Status updated');
      fetchTasks();
    } catch (err) {
      showToast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await adminService.deleteTask(deleteTarget._id);
      showToast.success('Task deleted');
      setDeleteTarget(null);
      fetchTasks();
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const inputClass = 'input-field';

  return (
    <div>
      <PageHeader
        title="All Tasks"
        subtitle={`${pagination.total} task${pagination.total === 1 ? '' : 's'} across all users`}
        actions={
          <Link to="/admin/add-task" className="btn-primary">
            <PlusCircle className="h-4 w-4" /> Assign Task
          </Link>
        }
      />

      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-card dark:border-gray-800 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Search tasks..."
              className={inputClass + ' pl-10'}
            />
          </div>
          <select value={filters.status} onChange={(e) => updateFilters({ status: e.target.value })} className={inputClass}>
            <option value="">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s === 'in-progress' ? 'In Progress' : capitalize(s)}</option>
            ))}
          </select>
          <select value={filters.priority} onChange={(e) => updateFilters({ priority: e.target.value })} className={inputClass}>
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{capitalize(p)}</option>
            ))}
          </select>
          <select value={filters.category} onChange={(e) => updateFilters({ category: e.target.value })} className={inputClass}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={filters.sort} onChange={(e) => updateFilters({ sort: e.target.value })} className={inputClass}>
            <option value="">Sort</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="due-date">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button onClick={resetFilters} className="btn-secondary py-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={applyFilters} className="btn-primary py-2">
            <SlidersHorizontal className="h-4 w-4" /> Apply
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="xl" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          message="Try adjusting your filters or assign a new task."
          action={
            <Link to="/admin/add-task" className="btn-primary">
              <PlusCircle className="h-4 w-4" /> Assign Task
            </Link>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-card dark:border-gray-800 dark:bg-gray-800">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-gray-700">
                  <th className="px-5 py-4 font-semibold">Task</th>
                  <th className="px-5 py-4 font-semibold">Assigned User</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Priority</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Due Date</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {tasks.map((task) => (
                  <tr key={task._id} className="transition hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</p>
                        {task.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar user={task.userId} size="sm" />
                        <span className="text-gray-600 dark:text-gray-300">{task.userId?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{task.category}</td>
                    <td className="px-5 py-4">
                      <Badge label={PRIORITY_META[task.priority].label} className={PRIORITY_META[task.priority].badge} />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={task.status}
                        onChange={(e) => doChangeStatus(task, e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 outline-none transition focus:border-primary-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTask(task)} title="View" className="rounded-lg p-2 text-gray-400 transition hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-primary-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => navigate(`/admin/edit-task/${task._id}`)} title="Edit" className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(task)} title="Delete" className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onChange={setPage}
            />
          </div>
        </>
      )}

      <TaskDetail task={viewTask} open={!!viewTask} onClose={() => setViewTask(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />
    </div>
  );
}