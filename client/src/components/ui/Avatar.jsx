import { getInitials } from '../../utils/helpers';

export default function Avatar({ user, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  };

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} avatar ${className}`}>{getInitials(user?.name)}</div>
  );
}