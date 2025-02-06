'use client';

import { FacebookIcon } from '@/icons/facebook-icon';
import { InstagramIcon } from '@/icons/instagram-icon';

interface Post {
  id: number;
  platform: 'facebook' | 'instagram';
  title: string;
  comments: number;
  replies: number;
  dm: number;
}

const posts: Post[] = [
  {
    id: 1,
    platform: 'facebook',
    title: 'On the off chance that you...',
    comments: 12,
    replies: 8,
    dm: 3
  },
  {
    id: 2,
    platform: 'facebook',
    title: 'While attempting to outlin...',
    comments: 8,
    replies: 5,
    dm: 2
  },
  {
    id: 3,
    platform: 'instagram',
    title: 'Commercial industry and ...',
    comments: 15,
    replies: 10,
    dm: 4
  },
  {
    id: 4,
    platform: 'facebook',
    title: 'The Oneplus 8 Pro is comi...',
    comments: 5,
    replies: 3,
    dm: 1
  }
];

export function RecentPosts() {
  return (
    <div className="h-[260px] relative">
      <div className="h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
            <tr className="text-sm text-gray-500">
              <th className="text-left font-medium pb-3 pr-4 w-[55%]">POST</th>
              <th className="text-center font-medium pb-3 px-4 w-[15%]">COMMENTS</th>
              <th className="text-center font-medium pb-3 px-4 w-[15%]">REPLIES</th>
              <th className="text-center font-medium pb-3 px-4 w-[15%]">DM</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {posts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {post.platform === 'facebook' ? (
                        <FacebookIcon className="w-4 h-4 text-blue-600" />
                      ) : (
                        <InstagramIcon className="w-4 h-4 text-pink-600" />
                      )}
                    </div>
                    <span className="text-gray-900 truncate">{post.title}</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4">{post.comments}</td>
                <td className="text-center py-3 px-4">{post.replies}</td>
                <td className="text-center py-3 px-4">{post.dm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}