'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function UpgradeCard() {
  return (
    <div className="w-full p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
      <p className="text-sm opacity-90 mb-4">
        Get access to advanced automation features and unlimited usage.
      </p>
      <Button
        variant="secondary"
        className="w-full bg-white text-indigo-600 hover:bg-white/90 flex items-center justify-center gap-2"
      >
        Upgrade Now
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
