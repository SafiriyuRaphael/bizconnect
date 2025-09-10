import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import getAllTransaction from '../api/getAllTransaction';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function useAnalytics() {
    const { data: session } = useSession()
    const router = useRouter()
    const [analyticsQuery, setAnalyticsQuery] = useState<AnalyticsQueryParams>({})

    const { data: allTransactions, isLoading: isFetchingTransactions, error, refetch } = useQuery({
        queryKey: ["analytics", analyticsQuery],
        queryFn: () => getAllTransaction(analyticsQuery),
    });

    const handleAllTransactionView = () => {
        router.push(`/profile/${session?.user.id}/transactions`)
    }

    return { allTransactions, isFetchingTransactions, analyticsQuery, setAnalyticsQuery, refetch, error, handleAllTransactionView }
}
