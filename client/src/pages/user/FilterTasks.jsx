import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListTodo, PlusCircle, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { taskService } from '../../services/apiService';
import { getErrorMessage, showToast } from '../../utils/helpers';
import { CATEGORIES, PRIORITIES, STATUSES } from '../../utils/constants';
import TaskCard from '../../components/tasks/TaskCard';
import TaskDetail from '../../components/tasks/TaskDetail';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function FilterTasks() {
  const { tasks, pagination, loading, setParams, refetch } = useTasks({ limit: 9 });
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '', dueDate: '', sort: '' });
  const [viewTask, setViewTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate();

  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const applyFilters = () => {
    const params = {};
    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.category) params.category = filters.category;
    if (filters.dueDate) params.dueDate = filters.dueDate;
    if (filters.sort) params.sort = filters.sort;
    params.page = 1;
    setParams(params);
    setApplied(true);
  };

  const resetFilters = () => {
    setFilters({ search: '', status: '', priority: '', category: '', dueDate: '', sort: '' });
    setParams({ limit: 9 });
    setApplied(false);
  };

  useEffect(() => {
    setParams({ limit: 9 });
  }, [setParams]);

  const hasFilters = applied && (filters.search || filters.status || filters.priority || filters.category || filters.dueDate);

  const handleStatusChange = async (id, status) => {
    try {
      await taskService.updateTask(id, { status });
      showToast.success('Status updated');
      refetch();
    } catch (err) {
      showToast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await taskService.deleteTask(deleteTask._id);
      showToast.success('Task deleted');
      setDeleteTask(null);
      refetch();
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const inputClass = 'input-field';
  const labelClass = 'label-field';

  return (
    <div>
      <PageHeader
        title="Filter Tasks"
        subtitle="Advanced filtering, search and sorting"
        actions={
          <button onClick={resetFilters} className="btn-secondary">
            <RotateCcw className="h-4 w-4" /> Reset Filters
          </button>
        }
      />

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <SlidersHorizontal className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          Filter Options
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClass}>Search by title</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="e.g. React, Login, Dashboard..."
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select value={filters.status} onChange={(e) => updateFilters({ status: e.target.value })} className={inputClass}>
              <option value="">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === 'in-progress' ? 'In Progress' : capitalize(s)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Priority</label>
            <select value={filters.priority} onChange={(e) => updateFilters({ priority: e.target.value })} className={inputClass}>
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{capitalize(p)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select value={filters.category} onChange={(e) => updateFilters({ category: e.target.value })} className={inputClass}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              value={filters.dueDate}
              onChange={(e) => updateFilters({ dueDate: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Sort By</label>
            <select value={filters.sort} onChange={(e) => updateFilters({ sort: e.target.value })} className={inputClass}>
              <option value="">Default</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="due-date">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={applyFilters} className="btn-primary">
            <Search className="h-4 w-4" /> Apply Filters
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
          title={hasFilters ? 'No tasks match your filters' : 'No tasks found'}
          message={
            hasFilters
              ? 'Try adjusting your search terms or clearing some filters.'
              : 'Apply filters above to narrow down your tasks.'
          }
          action={
            !hasFilters && (
              <Link to="/add-task" className="btn-primary">
                <PlusCircle className="h-4 w-4" /> Add Task
              </Link>
            )
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Found {pagination.total} matching task{pagination.total === 1 ? '' : 's'}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onView={setViewTask}
                onEdit={(t) => navigate(`/edit-task/${t._id}`)}
                onDelete={setDeleteTask}
                onChangeStatus={handleStatusChange}
              />
            ))}
          </div>
          <div className="mt-6">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onChange={(page) => setParams((prev) => ({ ...prev, page }))}
            />
          </div>
        </>
      )}

      <TaskDetail task={viewTask} open={!!viewTask} onClose={() => setViewTask(null)} />
      <ConfirmDialog
        open={!!deleteTask}
        title="Delete task"
        message={`Are you sure you want to delete "${deleteTask?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTask(null)}
        loading={actionLoading}
      />
    </div>
  );
}