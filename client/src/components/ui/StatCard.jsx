export default function StatCard({ icon: Icon, label, value, color = 'bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300', sub }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card transition hover:shadow-md dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-50">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}