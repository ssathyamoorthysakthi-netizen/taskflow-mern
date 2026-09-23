import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/apiService';
import { getErrorMessage, showToast } from '../../utils/helpers';
import StatCard from '../../components/ui/StatCard';
import TaskStatusChart from '../../components/charts/TaskStatusChart';
import TaskBarChart from '../../components/charts/TaskBarChart';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { STATUS_META, CHART_COLORS } from '../../utils/constants';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data);
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

  const statusData = [
    { name: 'Todo', value: stats.pendingTasks, color: CHART_COLORS.todo },
    { name: 'In Progress', value: stats.inProgressTasks, color: CHART_COLORS['in-progress'] },
    { name: 'Completed', value: stats.completedTasks, color: CHART_COLORS.completed },
  ];

  const priorityData = (stats.byPriority || []).map((p) => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    value: p.count,
  }));
  const priorityColors = ['#22c55e', '#eab308', '#ef4444'];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and statistics"
        actions={
          <Link to="/admin/add-task" className="btn-primary">
            <PlusCircle className="h-4 w-4" /> Assign Task
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300" />
        <StatCard icon={Layers} label="Total Tasks" value={stats.totalTasks} color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completedTasks} color="bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-300" />
        <StatCard icon={Circle} label="Pending" value={stats.pendingTasks} color="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" />
        <StatCard icon={Loader2} label="In Progress" value={stats.inProgressTasks} color="bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdueTasks} color="bg-orange-50 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">Tasks by Status</h3>
          <TaskStatusChart data={statusData} colors={[CHART_COLORS.todo, CHART_COLORS['in-progress'], CHART_COLORS.completed]} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">Tasks by Priority</h3>
          {priorityData.length ? (
            <TaskBarChart data={priorityData} colors={priorityColors} />
          ) : (
            <EmptyState title="No data" message="No tasks available yet." icon={AlertTriangle} />
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">Recent Activity</h3>
          {stats.recentTasks.length === 0 ? (
            <EmptyState title="No tasks yet" message="Assign a task to get started." />
          ) : (
            <div className="space-y-4">
              {stats.recentTasks.map((task) => (
                <Link
                  to="/admin/tasks"
                  key={task._id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-primary-200 hover:bg-primary-50/50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                >
                  <Avatar user={task.userId} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{task.title}</p>
                    <p className="text-xs text-gray-400">
                      {task.userId?.name || 'Unassigned'} ·{' '}
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </p>
                  </div>
                  <Badge label={STATUS_META[task.status].label} className={STATUS_META[task.status].badge} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}