import React, { useEffect, useMemo, useState } from 'react';
import { UserRound } from 'lucide-react';

type ProfileAvatarProps = {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
};

export const ProfileAvatar = ({ src, name, size = 48, className = '' }: ProfileAvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [src]);

  const initials = useMemo(() => {
    return name
      ? name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join('')
      : '';
  }, [name]);

  const placeholder = (
    <div
      className="flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm ring-2 ring-white"
      style={{ width: size, height: size }}
      aria-label={name ? `${name} avatar placeholder` : 'Default avatar placeholder'}
    >
      {initials ? (
        <span
          className="font-bold"
          style={{ fontSize: Math.max(12, Math.round(size * 0.34)) }}
        >
          {initials}
        </span>
      ) : (
        <UserRound size={Math.max(18, Math.round(size * 0.55))} strokeWidth={1.9} />
      )}
    </div>
  );

  if (!src || hasImageError) {
    return placeholder;
  }

  return (
    <img
      src={src}
      alt={name ? `${name}'s profile picture` : 'Profile picture'}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={() => setHasImageError(true)}
    />
  );
};