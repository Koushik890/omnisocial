'use client'

import { Button } from '@/components/ui/button'
import { CreditCardIcon } from 'lucide-react'

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL

interface Props {}

const PaymentButton = (props: Props) => {
  const onSubscribe = () => {
    if (CHECKOUT_URL) window.location.href = CHECKOUT_URL
  }

  return (
    <Button
      onClick={onSubscribe}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
    >
      <CreditCardIcon className="mr-2 h-4 w-4" />
      Upgrade Now
    </Button>
  )
}

export default PaymentButton
