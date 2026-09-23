import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 sm:text-lg">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 rounded-full transition hover:opacity-80"
          >
            <Avatar user={user} size="sm" />
          </button>
        </div>
      </div>
    </header>
  );
}