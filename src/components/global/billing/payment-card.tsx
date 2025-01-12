'use client'

import { cn } from "@/lib/utils"
import React from "react"
import { pricingPlans } from '@/components/sections/Pricing'
import { CircleCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import ArrowRight from '@/icons/ArrowRight'
import { useLemonSqueezy } from '@/hooks/use-lemonsqueezy'
import { useUser } from '@clerk/nextjs'
import { SUBSCRIPTION_PLAN } from '@prisma/client'

type props = {
    label: string
    current: 'PRO' | 'FREE'
    landing?: boolean
}

const PaymentCard = ({ label, current, landing }: props) => {
    const { user } = useUser();
    const { createCheckoutSession, isLoading } = useLemonSqueezy();

    const handleUpgrade = async () => {
        if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) return;

        await createCheckoutSession({
            userId: user.id,
            userEmail: user.emailAddresses[0].emailAddress,
            plan: SUBSCRIPTION_PLAN.PRO,
        });
    };

    return (
        <div className={cn(label !== current
            ? 'bg-background-90/50 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:via-purple-500/10 hover:to-pink-500/10 transition-all duration-300'
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
          'p-[2px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group h-full'
          )}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
                className={cn(
                    landing && 'radial--gradient--pink',
                    'flex flex-col rounded-xl px-8 py-8 bg-background/80 h-full backdrop-blur-sm relative z-10'
                  )}
            >   
                <div className="flex-1">
                    {landing ? (
                        <h2 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text">
                            {label === 'PRO' && 'Premium Plan'}
                            {label === 'FREE' && 'Standard'}
                        </h2>
                    ) : (
                        <h2 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text">
                            {label === current
                                ? 'Your Current Plan'
                                : current === 'PRO'
                                    ? 'Downgrade'
                                    : 'Upgrade'}
                        </h2>
                    )}
                    <p className="text-text-secondary/80 text-sm mb-4">
                        This is what your plan covers for automations and Ai features
                    </p>

                    {label === 'PRO' ? (
                        <span className="bg-gradient-to-r text-3xl from-indigo-400 via-purple-400 to-pink-400 font-bold bg-clip-text text-transparent mb-1">
                            Omni AI
                        </span>
                    ) : (
                        <div className="mb-1">
                            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Standard
                            </span>
                        </div>
                    )}
                    {label === 'PRO' ? (
                        <p className="mb-6">
                            <b className="text-3xl bg-gradient-to-r from-white to-white/90 bg-clip-text">$99</b>
                            <span className="text-text-secondary/70">/month</span>
                        </p>
                    ) : (
                        <p className="text-3xl font-bold mb-6">
                            <span className="text-3xl bg-gradient-to-r from-white to-white/90 bg-clip-text">Free</span>
                        </p>
                    )}

                    <div className="space-y-3">
                        {pricingPlans[label === 'PRO' ? 1 : 0].features.map((i) => (
                            <div
                                key={i}
                                className="text-text-secondary/90 flex items-start gap-2.5 group/item"
                            >
                                <div className="flex-shrink-0 w-5 h-5">
                                    <CircleCheck className="w-full h-full text-indigo-400 group-hover/item:text-indigo-300 transition-colors" />
                                </div>
                                <span className="flex-1 leading-5">{i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {landing && (
                    <Button
                        className={cn(
                            'rounded-full mt-8 py-6 font-medium transition-all duration-500 relative overflow-hidden group/button',
                            label === 'PRO'
                                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white/90 hover:text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 border border-white/10'
                                : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 hover:border-white/20'
                        )}
                        onClick={label === 'PRO' ? handleUpgrade : undefined}
                        disabled={isLoading}
                    >
                        <span className="relative z-10 inline-flex items-center gap-2">
                            {isLoading ? 'Loading...' : (label === current ? 'Get Started' : label === 'PRO' ? 'Upgrade to Pro' : 'Continue with Free')}
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </span>
                        {label === 'PRO' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-purple-400/10 to-pink-400/0 group-hover/button:opacity-50 opacity-0 transition-opacity duration-500" />
                        )}
                    </Button>
                )}
                {!landing && (
                    <Button
                        className={cn(
                            'rounded-full mt-8 py-6 font-medium transition-all duration-500 relative overflow-hidden group/button',
                            label === 'PRO'
                                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white/90 hover:text-white disabled:from-gray-700 disabled:to-gray-800 disabled:text-white/80 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 border border-white/10'
                                : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white backdrop-blur-sm disabled:bg-gray-800/50 disabled:text-white/90 disabled:border-white/5 border border-white/10 hover:border-white/20'
                        )}
                        disabled={label === current || isLoading}
                        onClick={label === 'PRO' ? handleUpgrade : undefined}
                    >
                        <span className="relative z-10 inline-flex items-center gap-2">
                            <span className={cn(
                                label === current && 'text-white/90 font-semibold',
                                'transition-colors'
                            )}>
                                {isLoading ? 'Loading...' : (label === current
                                    ? 'Current Plan'
                                    : label === 'PRO'
                                        ? 'Upgrade Now'
                                        : 'Downgrade Plan')}
                            </span>
                            {label !== current && !isLoading && (
                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </span>
                        {label === 'PRO' && !current && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-purple-400/10 to-pink-400/0 group-hover/button:opacity-50 opacity-0 transition-opacity duration-500" />
                        )}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default PaymentCard;