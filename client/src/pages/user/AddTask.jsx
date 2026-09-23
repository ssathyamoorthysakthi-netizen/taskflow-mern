import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { taskService } from '../../services/apiService';
import { getErrorMessage, showToast } from '../../utils/helpers';
import PageHeader from '../../components/ui/PageHeader';
import TaskForm from '../../components/tasks/TaskForm';

export default function AddTask() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await taskService.createTask(data);
      showToast.success('Task created successfully');
      navigate('/my-tasks');
    } catch (err) {
      showToast.error(getErrorMessage(err, 'Failed to create task'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Add Task"
        subtitle="Create a new task to track your work"
        actions={
          <Link to="/my-tasks" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Back to Tasks
          </Link>
        }
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800 sm:p-8">
        <TaskForm onSubmit={handleSubmit} submitLabel="Create Task" loading={loading} />
      </div>
    </div>
  );
}