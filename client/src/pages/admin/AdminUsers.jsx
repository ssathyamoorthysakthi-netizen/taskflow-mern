import { useEffect, useState } from 'react';
import { Users, Search, Eye, Pencil, Trash2, Loader2, Save, Mail, CalendarDays, Layers } from 'lucide-react';
import { adminService } from '../../services/apiService';
import { getErrorMessage, showToast } from '../../utils/helpers';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', role: 'user' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;
      const res = await adminService.getUsers(params);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, role: user.role });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editForm.name.trim().length < 2) {
      showToast.error('Name must be at least 2 characters');
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminService.updateUser(editUser._id, editForm);
      showToast.success(`User ${res.data.name} updated`);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await adminService.deleteUser(deleteTarget._id);
      showToast.success('User deleted');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const roleBadge = (role) =>
    role === 'admin'
      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';

  if (loading && users.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle={`${pagination.total} registered user${pagination.total === 1 ? '' : 's'}`}
      />

      <form
        onSubmit={handleSearchSubmit}
        className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="input-field w-auto"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </form>

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          message="No users match your filters."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-card dark:border-gray-800 dark:bg-gray-800">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-gray-700">
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Tasks</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} size="sm" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="px-5 py-4">
                      <Badge label={user.role} className={roleBadge(user.role)} />
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{user.taskCount}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{formatDateTime(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewUser(user)} title="View" className="rounded-lg p-2 text-gray-400 transition hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-primary-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEdit(user)} title="Edit" className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(user)} title="Delete" className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-300">
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

      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details">
        {viewUser && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar user={viewUser} size="lg" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{viewUser.name}</h4>
                <Badge label={viewUser.role} className={roleBadge(viewUser.role)} />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{viewUser.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Joined {formatDateTime(viewUser.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{viewUser.taskCount} task(s) assigned</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="label-field">Name</label>
            <input
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Role</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
              className="input-field"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={actionLoading}>
            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete user"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also delete all of their tasks. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />
    </div>
  );
}