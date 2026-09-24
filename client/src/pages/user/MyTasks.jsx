import { useState } from 'react';
import { ListTodo, Search, ArrowUpDown } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from '../../components/tasks/TaskCard';
import TaskDetail from '../../components/tasks/TaskDetail';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';

export default function MyTasks() {
  const { tasks, pagination, loading, setParams } = useTasks({ limit: 9 });
  const [search, setSearch] = useState('');
  const [viewTask, setViewTask] = useState(null);

  const handleSearch = (value) => {
    setSearch(value);
    setParams((prev) => ({ ...prev, search: value || undefined, page: 1 }));
  };

  const handleSort = (e) => {
    setParams((prev) => ({ ...prev, sort: e.target.value || undefined, page: 1 }));
  };

  return (
    <div>
      <PageHeader
        title="My Tasks"
        subtitle={`You have ${pagination.total} task${pagination.total === 1 ? '' : 's'} in total`}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search your tasks..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <ArrowUpDown className="h-4 w-4" />
          <select onChange={handleSort} className="input-field w-auto py-2">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="due-date">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="xl" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title={search ? 'No tasks match your search' : 'No tasks found'}
          message={
            search
              ? 'Try adjusting your search or clear the filters.'
              : 'You have no assigned tasks yet.'
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onView={setViewTask}
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
    </div>
  );
}