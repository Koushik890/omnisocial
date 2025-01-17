import React from "react";
import AutomationsBreadCrumb from "@/components/global/bread-crumbs/automations";
import { Warning } from '@/icons'
import Trigger from "@/components/global/automations/trigger";
import { getAutomationInfo } from "@/actions/automations";
import { PrefetchUserAutomation } from "@/react-query/prefetch";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import PostNode from '@/components/global/automations/post/node'
import ThenNode from '@/components/global/automations/then/node'

type PageProps = {
    params: {
        id: string;
        slug: string;
    };
};

export async function generateMetadata({ params }: PageProps) {
    const info = await getAutomationInfo(params.id);
    return {
        title: info.data?.name,
    };
}

const Page = async ({ params }: PageProps) => {
    const automationId = params.id;
    
    const query = new QueryClient();
    await PrefetchUserAutomation(query, automationId);

    return (
        <HydrationBoundary state={dehydrate(query)}>
            <div className="flex flex-col items-center gap-y-20">
                <AutomationsBreadCrumb id={automationId} />
                <div className="w-full lg:w-10/12 xl:w-6/12 p-5 rounded-xl flex flex-col bg-[#1D1D1D] gap-y-3 text-white">
                    <div className="flex items-center gap-2">
                        <Warning />
                        When...
                    </div>
                    <Trigger id={automationId} />
                </div>
                <ThenNode id={automationId} />
                <PostNode id={automationId} />
            </div>
        </HydrationBoundary>
    );
};

export default Page;
