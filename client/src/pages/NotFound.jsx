import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
        <SearchX className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-5xl font-bold text-gray-900 dark:text-gray-50">404</h1>
      <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Page not found</p>
      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}