'use client';

import Image from 'next/image';

interface ProfileImageProps {
  avatarUrl: string;
  username: string;
}

export function ProfileImage({ avatarUrl, username }: ProfileImageProps) {
  return (
    <div className="relative">
      {/* Main container */}
      <div className="relative h-[120px] w-[120px] rounded-[30px] p-[3px] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
        {/* Solid white ring */}
        <div className="absolute inset-0 rounded-[30px] border-[3px] border-white"></div>

        {/* Image container with solid background */}
        <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-white">
          <Image
            src={avatarUrl}
            alt={username}
            fill
            className="object-cover"
            priority
            sizes="120px"
            quality={90}
          />
        </div>
      </div>
    </div>
  );
}