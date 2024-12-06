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
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 h-[180px] mb-8">
      <div className="relative flex gap-8 h-full py-8 px-6">
        <ProfileImage avatarUrl={avatarUrl} username={username} />
        <div className="flex-1">
          <div className="flex items-center justify-between h-full">
            <ProfileInfo
              username={username}
              displayName={displayName}
              bio={bio}
              website={website}
            />
            <ProfileStats
              posts={posts}
              followers={followers}
              following={following}
            />
          </div>
        </div>
      </div>
    </div>
  );
}