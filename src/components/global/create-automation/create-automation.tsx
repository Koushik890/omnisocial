'use client';

import { Button } from "@/components/ui/button";
import { AutomationDuoToneWhite } from "@/icons/automation-duotone-white";

const CreateAutomation = () => {
  // TODO: Implement automation creation using useMutation from TanStack Query
  // const { mutate } = useMutation({
  //   mutationFn: async (data: AutomationInput) => {
  //     const response = await fetch('/api/automations', {
  //       method: 'POST',
  //       body: JSON.stringify(data)
  //     })
  //     return response.json()
  //   },
  //   onSuccess: () => {
  //     // Invalidate and refetch automations query
  //     queryClient.invalidateQueries({ queryKey: ['automations'] })
  //   }
  // })

  return (
    <Button
      className="hidden lg:flex items-center gap-2 bg-[#8D4AF3] hover:bg-[#7B3FD7] text-white rounded-xl px-4 py-2.5 transition-all duration-200"
    >
      <AutomationDuoToneWhite />
      <span className="text-sm font-medium">Create Automation</span>
    </Button>
  );
};

export default CreateAutomation;
