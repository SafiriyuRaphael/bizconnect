import { useCallback, useEffect, useState } from "react";
import { AllUserData, AnyUser, Pagination, UserQueryParams } from "../../types";
import getAllUsers from "@/lib/admin/getAllUsers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FetchUsersFn = (params: UserQueryParams) => Promise<AllUserData>;

export default function useUser(fetcher: FetchUsersFn = getAllUsers) {
    const { data: session } = useSession();
    const router = useRouter()
    const [params, setParams] = useState<UserQueryParams>({})
    const [filteredUsers, setFilteredUsers] = useState<
        AnyUser[]
    >([]);
    const [viewMode, setViewMode] = useState("grid");
    const [showMobileFilters, setShowMobileFilters] = useState(false);


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [pagination, setPagination] = useState<Pagination>({ business: 0, customers: 0, limit: 12, page: 1, total: 0, totalPages: 1 });

    const { role, search, sortBy, sortOrder, userType, verified, page } = params

    // Debounced search function
    const debouncedFetchUsers = useCallback(
        async (params: UserQueryParams) => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetcher(params);
                console.log(data);

                if (params.page === 1) {
                    setFilteredUsers(data.data);
                } else {
                    setFilteredUsers((prev) => [...prev, ...data.data]);
                }

                setPagination(data.pagination)
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch Users"
                );
                console.error("Error fetching Users:", err);
            } finally {
                setLoading(false);
            }
        },
        [fetcher]
    );

    // Effect to fetch data when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params: UserQueryParams = {
                userType,
                search, sortBy, role, verified,
                page, sortOrder,
                limit: 12,
            };
            if (page === 1) {
                setFilteredUsers([]);
            }

            debouncedFetchUsers(params);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [
        params,
        debouncedFetchUsers,
    ]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams((prev) => ({ ...prev, search: e.target.value }))
        setParams((prev) => ({ ...prev, page: 1 }))
    };


    const handleChat = ((businessId: string) => {
        const isLoggedIn = !!session?.user;
        if (!isLoggedIn) {
            router.push("/auth/login")
        } else {
            router.push(`/chat/?recipientId=${businessId}`)
        }
    })

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParams((prev) => ({ ...prev, sortBy: e.target.value }))
        setParams((prev) => ({ ...prev, page: 1 }))
    };

    const handleLoadMore = () => {
        setParams((prev) => ({
            ...prev,
            page: (prev.page || 1) + 1
        }));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.total) return;
        setParams(() => ({ page: newPage }));
    };

    const clearAllFilters = () => {
        setParams({})
    };
    return { search, handleSearchChange, setShowMobileFilters, showMobileFilters, filteredUsers, loading, sortBy, handleSortChange, setViewMode, viewMode, error, debouncedFetchUsers, clearAllFilters, handleLoadMore, pagination, handleChat, params, handlePageChange }
}
