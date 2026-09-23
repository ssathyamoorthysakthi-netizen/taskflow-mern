import { useState } from 'react';
import { Camera, Save, Loader2, Mail, ShieldCheck, CalendarDays, UserRound, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/apiService';
import { getErrorMessage, showToast, formatDateTime, getInitials } from '../utils/helpers';
import PageHeader from '../components/ui/PageHeader';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [customImage, setCustomImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangeImage = (url) => {
    setProfileImage(url);
    setCustomImage('');
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authService.updateProfile({ name: name.trim(), profileImage });
      updateUser(res.data);
      showToast.success('Profile updated successfully');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Profile" subtitle="Manage your account information" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800">
          <div className="flex flex-col items-center text-center">
            {profileImage ? (
              <img src={profileImage} alt="avatar" className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/50" />
            ) : (
              <div className="avatar h-24 w-24 text-3xl ring-4 ring-primary-100 dark:ring-primary-900/50">
                {getInitials(user?.name)}
              </div>
            )}
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-50">{user?.name}</h3>
            <p className="text-sm capitalize text-gray-400">{user?.role}</p>
          </div>

          <div className="mt-5 space-y-2">
            <button
              onClick={() => handleChangeImage(`https://api.dicebear.com/7.x/initials/svg?seed=${getInitials(user?.name)}&backgroundColor=6366f1`)}
              className="btn-secondary w-full"
            >
              <Camera className="h-4 w-4" /> Use generated avatar
            </button>
            <button
              onClick={() => handleChangeImage('')}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                profileImage === ''
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              No image (initials)
            </button>
          </div>

          <div className="mt-4">
            <label className="label-field">
              <span className="inline-flex items-center gap-1.5"><Upload className="h-4 w-4" /> Image URL</span>
            </label>
            <div className="flex gap-2">
              <input
                value={customImage}
                onChange={(e) => setCustomImage(e.target.value)}
                placeholder="https://.../image.png"
                className="input-field"
              />
              <button
                onClick={() => {
                  if (customImage.trim()) {
                    handleChangeImage(customImage.trim());
                    showToast.success('Avatar updated');
                  }
                }}
                className="btn-secondary shrink-0"
                type="button"
              >
                Set
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={UserRound} label="Email" value={user?.email} />
            <InfoRow icon={ShieldCheck} label="Role" value={user?.role} />
            <InfoRow icon={CalendarDays} label="Member since" value={formatDateTime(user?.createdAt)} />
          </div>

          <form onSubmit={handleSave} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="label-field">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-gray-100 bg-primary-50 p-5 text-sm text-primary-800 dark:border-gray-700 dark:bg-primary-900/30 dark:text-primary-200">
            Tip: You can use any publicly hosted image URL for your avatar, or let TaskFlow generate a
            placeholder for you.
          </div>
        </div>
      </div>
    </div>
  );
}