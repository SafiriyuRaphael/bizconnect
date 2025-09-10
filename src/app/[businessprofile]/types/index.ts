type GetUserItemsQuery = {
    page?: string;
    limit?: string;
    id?: string;
    q?: string;
    filterBy?: "all" | "product" | "service" | "available" | "unavailable";
    sortBy?: "createdAt" | "name" | "price-low" | "price-high" | "availability";
};