import { useCallback, useEffect, useState } from "react";
import { AllBusinessProps, BusinessQueryParams } from "../../types";
import getAllBusiness from "@/lib/business/getAllBusiness";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FetchBusinessesFn = (params: BusinessQueryParams) => Promise<{
  entrepreneurs: AllBusinessProps[];
  total: number;
}>;

export default function useDashboard(fetcher: FetchBusinessesFn = getAllBusiness) {
  const { data: session } = useSession();
  const router = useRouter()
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredBusinesses, setFilteredBusinesses] = useState<
    AllBusinessProps[]
  >([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "newest" | "rating" | "price-low" | "price-high" | "best"
  >("best");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryRange, setDeliveryRange] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  // Debounced search function
  const debouncedFetchBusinesses = useCallback(
    async (params: BusinessQueryParams) => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetcher(params);
        console.log(data);

        if (params.page === 1) {
          setFilteredBusinesses(data.entrepreneurs);
        } else {
          setFilteredBusinesses((prev) => [...prev, ...data.entrepreneurs]);
        }

        setTotal(data.total);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch businesses"
        );
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetcher]
  );

  // Effect to fetch data when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params: BusinessQueryParams = {
        category: selectedCategory,
        search: searchQuery.trim() || undefined,
        sort: sortBy,
        maxPrice: priceRange,
        deliveryTime: deliveryRange.length === 1 ? deliveryRange[0] : undefined,
        page: currentPage,
        rating: selectedRating || undefined,
        limit: 12,
      };
      if (currentPage === 1) {
        setFilteredBusinesses([]);
      }

      debouncedFetchBusinesses(params);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedCategory,
    sortBy,
    currentPage,
    priceRange,
    deliveryRange,
    selectedRating,
    debouncedFetchBusinesses,
  ]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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
    setSortBy(e.target.value as typeof sortBy);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange(1000);
    setDeliveryRange([]);
    setSelectedRating(null);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };
  return { searchQuery, handleSearchChange, setShowMobileFilters, showMobileFilters, selectedCategory, filteredBusinesses, loading, sortBy, handleSortChange, setViewMode, viewMode, error, debouncedFetchBusinesses, setSelectedServices, selectedServices, clearAllFilters, handleLoadMore, total, priceRange, setPriceRange, setDeliveryRange, setSelectedRating, setCurrentPage, setSelectedCategory, selectedRating, handleChat }
}
