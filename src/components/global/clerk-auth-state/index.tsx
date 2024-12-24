'use client';

import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface ClerkAuthStateProps {
  isCollapsed?: boolean;
}

const ClerkAuthState = ({ isCollapsed = false }: ClerkAuthStateProps) => {
  return (
    <div 
      className={cn(
        "flex items-center rounded-full p-2.5 transition-all duration-200 relative w-full",
        isCollapsed ? "justify-center" : "gap-x-3"
      )}
    >
      <div className="flex items-center gap-x-3">
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
    </div>
  );
};

export default ClerkAuthState;
