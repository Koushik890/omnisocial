'use client';

import { ProfileImage } from './ProfileImage';
import { ProfileInfo } from './ProfileInfo';
import { ProfileStats } from './ProfileStats';

interface InstagramProfileProps {
  username: string;
  displayName: string;
  bio: string;
  website: string;
  posts: number;
  followers: number;
  following: number;
  avatarUrl: string;
}

export function InstagramProfile({
  username,
  displayName,
  bio,
  website,
  posts,
  followers,
  following,
  avatarUrl
}: InstagramProfileProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#D3B9FF] to-[#E5CCFF] rounded-2xl border border-[#E0D5FF] shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden backdrop-blur-sm mb-8">
      <div className="absolute inset-0 bg-white/60 backdrop-filter backdrop-blur-sm" />
      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <ProfileImage avatarUrl={avatarUrl} username={username} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="max-w-[400px]">
                <ProfileInfo
                  username={username}
                  displayName={displayName}
                  bio={bio}
                  website={website}
                />
              </div>
              <div className="sm:ml-4 flex items-center justify-center sm:h-full">
                <ProfileStats
                  posts={posts}
                  followers={followers}
                  following={following}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}