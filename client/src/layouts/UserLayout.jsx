import { LayoutDashboard, ListTodo, Filter, UserCircle, LogOut } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/helpers';

export default function UserLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast.success('Logged out successfully');
    navigate('/login');
  };

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/my-tasks', label: 'My Tasks', icon: ListTodo },
    { to: '/filter-tasks', label: 'Filter Tasks', icon: Filter },
    { to: '/profile', label: 'Profile', icon: UserCircle },
    { to: '#', label: 'Logout', icon: LogOut, action: handleLogout },
  ];

  return <AppShell items={items} />;
}