import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { taskService } from '../../services/apiService';
import { getErrorMessage, showToast } from '../../utils/helpers';
import PageHeader from '../../components/ui/PageHeader';
import TaskForm from '../../components/tasks/TaskForm';
import Spinner from '../../components/ui/Spinner';

export default function EditTask() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await taskService.getTask(id);
        setTask(res.data);
      } catch (err) {
        showToast.error(getErrorMessage(err, 'Failed to load task'));
        navigate('/my-tasks');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await taskService.updateTask(id, data);
      showToast.success('Task updated successfully');
      navigate('/my-tasks');
    } catch (err) {
      showToast.error(getErrorMessage(err, 'Failed to update task'));
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

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Edit Task"
        subtitle="Update the details of your task"
        actions={
          <Link to="/my-tasks" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Back to Tasks
          </Link>
        }
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800 sm:p-8">
        <TaskForm initialData={task} onSubmit={handleSubmit} submitLabel="Update Task" loading={saving} />
      </div>
    </div>
  );
}