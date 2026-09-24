import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ListTodo,
  Circle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { taskService } from '../../services/apiService';
import { getErrorMessage, showToast } from '../../utils/helpers';
import StatCard from '../../components/ui/StatCard';
import TaskStatusChart from '../../components/charts/TaskStatusChart';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { PRIORITY_META, STATUS_META, CHART_COLORS } from '../../utils/constants';

export default function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          taskService.getStats(),
          taskService.getTasks({ limit: 5, status: undefined, sort: 'newest' }),
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.tasks);
      } catch (err) {
        showToast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  const chartData = [
    { name: 'Todo', value: stats.todo, color: CHART_COLORS.todo },
    { name: 'In Progress', value: stats.inProgress, color: CHART_COLORS['in-progress'] },
    { name: 'Completed', value: stats.completed, color: CHART_COLORS.completed },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Here's an overview of your tasks"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Layers} label="Total Tasks" value={stats.total} color="bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300" />
        <StatCard icon={Circle} label="Todo" value={stats.todo} color="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" />
        <StatCard icon={Loader2} label="In Progress" value={stats.inProgress} color="bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-300" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue} color="bg-orange-50 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300" />
        <StatCard icon={Flag} label="High Priority" value={stats.highPriority} color="bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">Task Status Overview</h3>
          <TaskStatusChart data={chartData} colors={[CHART_COLORS.todo, CHART_COLORS['in-progress'], CHART_COLORS.completed]} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">Recent Tasks</h3>
            <Link to="/my-tasks" className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View all <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No tasks yet"
              message="Your assigned tasks will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-gray-700">
                    <th className="pb-3 pr-4 font-semibold">Task</th>
                    <th className="pb-3 pr-4 font-semibold">Priority</th>
                    <th className="pb-3 pr-4 font-semibold">Status</th>
                    <th className="pb-3 pr-4 font-semibold">Due Date</th>
                    <th className="pb-3 font-semibold">Assigned User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentTasks.map((task) => (
                    <tr key={task._id} className="transition hover:bg-gray-50 dark:hover:bg-gray-700/40">
                      <td className="py-3 pr-4">
                        <Link to="/my-tasks" className="font-semibold text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400">
                          {task.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge label={PRIORITY_META[task.priority].label} className={PRIORITY_META[task.priority].badge} />
                      </td>
                      <td className="py-3 pr-4">
                        <Badge label={STATUS_META[task.status].label} className={STATUS_META[task.status].badge} />
                      </td>
                      <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-300">
                        {task.userId?.name || 'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}