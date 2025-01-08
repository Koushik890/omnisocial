import React from 'react'
import { Check } from 'lucide-react'
import CreateAutomation from '@/components/global/create-automation'
import AutomationList from '@/components/global/automation-list/index'

type Props = {}



const Page = (props: Props) => {
  // TODO: connect real automations list
   
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <AutomationList/>
      </div>
      <div className="lg:col-span-2">
        <div className="flex flex-col rounded-xl bg-background-80 gap-y-6 p-5 border-[1px] overflow-hidden border-in-active">

          <div>
            <h2 className="text-xl ">Automations</h2>
            <p className="text-text-secondary">
              Your live automations will show here.
            </p>
          </div>

          <div className="flex flex-col gap-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-start justify-between"
              >
                <div className="flex flex-col">
                  <h3 className="font-medium">
                    Direct traffic towards website
                  </h3>
                  <p className="text-text-secondary text-sm">
                    October 5th 2024
                  </p>
                </div>
                <Check />
              </div>
            ))}
          </div>
          <CreateAutomation />
        </div>
      </div>
    </div>
  )
}

export default Page