import { NavLink } from 'react-router-dom';
import { CheckSquare, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ items, open, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-gray-900 dark:text-gray-50">TaskFlow</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Manage your day</p>
            </div>
          </NavLink>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 lg:hidden dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {items.map((item) => {
            const itemClass =
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition';

            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onClose();
                    item.action();
                  }}
                  className={`${itemClass} w-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `${itemClass} ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="truncate text-xs capitalize text-gray-400 dark:text-gray-500">{user?.role}</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}