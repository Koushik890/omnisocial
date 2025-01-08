'use client';

import { Button } from "@/components/ui/button";
import { AutomationDuoToneWhite } from "@/icons/automation-duotone-white";
import Loader from "@/components/global/loader";
import { useCreateAutomation } from '@/hooks/use-automations'
import React, { useMemo } from 'react'
import { v4 } from 'uuid'


const CreateAutomation = () => {
  // TODO: Implement automation creation using useMutation from TanStack Query

  const mutationId = useMemo(() => v4(), [])


  console.log(mutationId)
  const { isPending, mutate } = useCreateAutomation(mutationId)

  return (
    <Button
      className="hidden lg:flex items-center gap-2 bg-[#8D4AF3] hover:bg-[#7B3FD7] text-white rounded-xl px-4 py-2.5 transition-all duration-200"
      onClick={() =>
        mutate({
          name: 'Untitled',
          id: mutationId,
          createdAt: new Date(),
          keywords: [],
        })
      }>
      <Loader state={isPending}>
        <div className="flex items-center gap-2">
          <AutomationDuoToneWhite />
          <span className="text-sm font-medium">Create Automation</span>
        </div>
      </Loader>
    </Button>
  );
};

export default CreateAutomation;
