import { useEffect, useState } from 'react';
import { Calendar, Flag, FolderKanban, Loader2, Save } from 'lucide-react';
import { CATEGORIES, PRIORITIES, STATUSES } from '../../utils/constants';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function TaskForm({ initialData, users = [], onSubmit, submitLabel = 'Save Task', loading }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Development',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    userId: '',
  });

  const [errors, setErrors] = useState({});

  const allowAssign = users.length > 0;

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Development',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'todo',
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
        userId: initialData.userId?._id || initialData.userId || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (form.dueDate && isNaN(Date.parse(form.dueDate))) next.dueDate = 'Invalid due date';
    if (allowAssign && !form.userId) next.userId = 'Please assign a user';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      userId: allowAssign ? form.userId : undefined,
    });
  };

  const fieldClass = 'input-field';
  const labelClass = 'label-field';

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4 lg:col-span-2">
        <div>
          <label className={labelClass}>Title <span className="text-red-500">*</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Build the login page"
            className={fieldClass}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>}
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the task..."
            className={`${fieldClass} resize-none`}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-1.5"><FolderKanban className="h-4 w-4" /> Category</span>
          </label>
          <select name="category" value={form.category} onChange={handleChange} className={fieldClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-1.5"><Flag className="h-4 w-4" /> Priority</span>
          </label>
          <select name="priority" value={form.priority} onChange={handleChange} className={fieldClass}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{capitalize(p)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={fieldClass}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s === 'in-progress' ? 'In Progress' : capitalize(s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Due Date</span>
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className={fieldClass}
          />
          {errors.dueDate && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.dueDate}</p>}
        </div>

        {allowAssign && (
          <div>
            <label className={labelClass}>Assign To <span className="text-red-500">*</span></label>
            <select name="userId" value={form.userId} onChange={handleChange} className={fieldClass}>
              <option value="">Select a user...</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
            {errors.userId && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.userId}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 lg:col-span-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}