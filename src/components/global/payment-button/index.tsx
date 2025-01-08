'use client';

import { Button } from "@/components/ui/button";
import { CreditCardIcon, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";

type Props = {}

const PaymentButton = (props: Props) => {
  const { onSubscribe, isProcessing } = useSubscription();

  return (
    <Button
      disabled={isProcessing}
      onClick={onSubscribe}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
    >
      {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CreditCardIcon className="mr-2 h-4 w-4" />}
      Upgrade Now
    </Button>
  );
};

export default PaymentButton;
