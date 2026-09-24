import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/ui/Spinner';

import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';

import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import MyTasks from './pages/user/MyTasks';
import FilterTasks from './pages/user/FilterTasks';
import Profile from './pages/Profile';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTasks from './pages/admin/AdminTasks';
import AdminAssignTask from './pages/admin/AdminAssignTask';
import AdminEditTask from './pages/admin/AdminEditTask';
import AdminUsers from './pages/admin/AdminUsers';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="filter-tasks" element={<FilterTasks />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="add-task" element={<AdminAssignTask />} />
          <Route path="edit-task/:id" element={<AdminEditTask />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}