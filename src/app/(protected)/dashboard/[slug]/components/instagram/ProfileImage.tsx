'use client';

import Image from 'next/image';

interface ProfileImageProps {
  avatarUrl: string;
  username: string;
}

export function ProfileImage({ avatarUrl, username }: ProfileImageProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <Image
          src={avatarUrl || '/images/placeholder-user.png'}
          alt={`${username}'s profile picture`}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 640px) 80px, 96px"
          priority
        />
      </div>
    </div>
  );
}