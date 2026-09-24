import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users2 } from 'lucide-react';
import { adminService, taskService } from '../../services/apiService';
import { getErrorMessage, showToast } from '../../utils/helpers';
import PageHeader from '../../components/ui/PageHeader';
import TaskForm from '../../components/tasks/TaskForm';
import Spinner from '../../components/ui/Spinner';

export default function AdminAssignTask() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.getUsers({ limit: 100 });
        setUsers(res.data.users.filter((u) => u.role !== 'admin'));
      } catch (err) {
        showToast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await taskService.createTask(data);
      showToast.success('Task assigned successfully');
      navigate('/admin/tasks');
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div>
        <PageHeader
          title="Assign Task"
          subtitle="Create and assign a task to a user"
          actions={
            <Link to="/admin/tasks" className="btn-secondary">
              <ArrowLeft className="h-4 w-4" /> Back to Tasks
            </Link>
          }
        />
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <Users2 className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-3 text-base font-semibold text-gray-800 dark:text-gray-100">No regular users yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a user account first from Admin → Users, then come back to assign a task.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Assign Task"
        subtitle="Create a task and assign it to a registered user"
        actions={
          <Link to="/admin/tasks" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Back to Tasks
          </Link>
        }
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800 sm:p-8">
        <TaskForm users={users} onSubmit={handleSubmit} submitLabel="Assign Task" loading={saving} />
      </div>
    </div>
  );
}