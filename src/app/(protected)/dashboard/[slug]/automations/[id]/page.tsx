import React from "react";
import { getAutomationInfo } from "@/actions/automations";
import { PrefetchUserAutomation } from "@/react-query/prefetch";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { AutomationClient } from "./client";

interface PageProps {
    params: Promise<{
        id: string;
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps) {
    const resolvedParams = await params;
    const info = await getAutomationInfo(resolvedParams.id);
    return {
        title: info.data?.name,
    };
}

const Page = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const query = new QueryClient();
    await PrefetchUserAutomation(query, resolvedParams.id);

    return (
        <HydrationBoundary state={dehydrate(query)}>
            <AutomationClient id={resolvedParams.id} />
        </HydrationBoundary>
    );
};

export default Page;
