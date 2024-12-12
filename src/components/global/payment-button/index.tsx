'use client';

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const PaymentButton = () => {
  const handleUpgrade = async () => {
    // TODO: Implement payment logic
    console.log('Upgrade clicked');
  };

  return (
    <Button
      onClick={handleUpgrade}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
    >
      <Sparkles className="mr-2 h-4 w-4" />
      Upgrade Now
    </Button>
  );
};

export default PaymentButton;
