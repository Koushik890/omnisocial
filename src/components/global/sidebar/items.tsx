import { SIDEBAR_MENU } from '@/constants/menu';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

type Props = {
  page: string;
  slug: string;
  isCollapsed?: boolean;
};

const Items = ({ page, slug, isCollapsed }: Props) => {
  const linkStyles = cn(
    "flex rounded-full p-3 transition-all duration-200 hover:bg-white/10",
    isCollapsed ? "justify-center" : "gap-x-2"
  );
  const activeLinkStyles = "bg-[#8D4AF3] text-white shadow-md";
  const inactiveLinkStyles = "text-white/80";

  return (
    <div className="flex flex-col gap-y-1">
      {SIDEBAR_MENU.map((item) => (
        <Link
          key={item.id}
          href={`/dashboard/${slug}/${item.label === 'home' ? '' : item.label}`}
          className={cn(
            linkStyles,
            page === item.label || (page === slug && item.label === 'home')
              ? activeLinkStyles
              : inactiveLinkStyles
          )}
        >
          {item.icon}
          {!isCollapsed && <span className="capitalize">{item.label}</span>}
        </Link>
      ))}
    </div>
  );
};

export default Items;
