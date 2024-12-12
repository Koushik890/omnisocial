'use client';

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CreateAutomation = () => {
  return (
    <Button
      className="hidden lg:flex items-center gap-2 bg-[#8D4AF3] hover:bg-[#7B3FD7] text-white rounded-xl px-4 py-2.5 transition-all duration-200"
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm font-medium">Create Automation</span>
    </Button>
  );
};

export default CreateAutomation;
