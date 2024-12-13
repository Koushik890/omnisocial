'use client';

interface ProfileInfoProps {
  username: string;
  displayName: string;
  bio: string;
  website: string;
}

export function ProfileInfo({ username, displayName, bio, website }: ProfileInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{displayName}</h2>
        <span className="text-xs sm:text-sm text-gray-500">@{username}</span>
      </div>
      <div className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">
        {bio}
      </div>
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline inline-block break-words"
        >
          {website}
        </a>
      )}
    </div>
  );
}