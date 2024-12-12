'use client';

import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface ClerkAuthStateProps {
  isCollapsed?: boolean;
}

const ClerkAuthState = ({ isCollapsed = false }: ClerkAuthStateProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    const clerkButton = buttonRef.current?.querySelector('button');
    if (clerkButton) {
      clerkButton.click();
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={cn(
        "flex items-center rounded-full p-2.5 transition-all duration-200 hover:bg-white/10 cursor-pointer relative w-full",
        isCollapsed ? "justify-center" : "gap-x-3"
      )}
    >
      <div ref={buttonRef} className="flex items-center gap-x-3">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 ring-2 ring-white/30",
              userButtonPopup: "ml-2"
            }
          }}
        />
        {!isCollapsed && <span className="font-medium text-white select-none">Profile</span>}
      </div>
    </button>
  );
};

export default ClerkAuthState;
