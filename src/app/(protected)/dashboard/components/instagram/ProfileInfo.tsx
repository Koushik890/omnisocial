'use client';

interface ProfileInfoProps {
  username: string;
  displayName: string;
  bio: string;
  website: string;
}

export function ProfileInfo({ username, displayName, bio, website }: ProfileInfoProps) {
  return (
    <div className="flex flex-col max-w-[400px]">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">@{username}</h2>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-1 rounded-full shadow-[0_2px_8px_rgb(59,130,246,0.25)]">
          <svg className="h-5 w-5 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
      </div>
      <div className="text-base font-medium text-gray-700 mb-2">{displayName}</div>
      <div className="text-sm text-gray-600 mb-2 leading-relaxed line-clamp-2">
        {bio.split(' ').map((word, index) => (
          word.startsWith('@') ? (
            <span key={index} className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer transition-colors duration-200">{word} </span>
          ) : (
            <span key={index}>{word} </span>
          )
        ))}
      </div>
      <a 
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200 truncate"
      >
        {website.replace('http://', '').replace('https://', '')}
      </a>
    </div>
  );
}