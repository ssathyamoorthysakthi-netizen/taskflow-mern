import { LayoutDashboard, Users, ListTodo, PlusCircle, UserCircle, LogOut } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/helpers';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast.success('Logged out successfully');
    navigate('/login');
  };

  const items = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/tasks', label: 'All Tasks', icon: ListTodo },
    { to: '/admin/add-task', label: 'Assign Task', icon: PlusCircle },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/profile', label: 'Profile', icon: UserCircle },
    { to: '#', label: 'Logout', icon: LogOut, action: handleLogout },
  ];

  return <AppShell items={items} />;
}