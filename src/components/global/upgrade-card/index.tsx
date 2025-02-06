'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function UpgradeCard() {
  return (
    <div className="mx-3 p-4 rounded-2xl bg-gradient-to-br from-[#8D4AF3] to-[#A288F7] text-white">
      <h3 className="font-semibold">Upgrade to Pro</h3>
      <p className="text-sm text-white/80 mt-1">Get access to all features and remove limits.</p>
      <Button 
        variant="secondary" 
        className="w-full mt-4 bg-white hover:bg-white/90 text-[#8D4AF3]"
      >
        Upgrade Now
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
} 