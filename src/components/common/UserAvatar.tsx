

interface UserAvatarProps {
  avatarUrl?: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ avatarUrl, username, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-lg',
    lg: 'w-16 h-16 text-3xl'
  }[size];

  if (avatarUrl && avatarUrl.startsWith('preset:')) {
    const [_, emoji, bg] = avatarUrl.split(':');
    return (
      <div className={`rounded-full bg-gradient-to-br ${bg || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white font-sans ${sizeClasses} shadow-sm border border-white/20 select-none`}>
        {emoji}
      </div>
    );
  }

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={`rounded-full object-cover border border-black/10 shadow-sm ${sizeClasses}`}
      />
    );
  }

  // Fallback to initial letters
  const initial = username ? username.charAt(0).toUpperCase() : '?';
  return (
    <div className={`rounded-full bg-gradient-to-br from-blue-500 to-indigo-655 flex items-center justify-center text-white font-bold font-sans ${sizeClasses} border border-white/20 select-none`}>
      {initial}
    </div>
  );
}
