import React, { useCallback, useState } from "react";
import getTransactions from "../api/getTransactions";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import formatDate from "@/lib/static/formatDate";

export default function useTransactions() {
  const [transactionsQuery, setTransactionsQuery] = useState<TransactionQuery>({
    limit: 10,
    page: 1,
  });
  const {
    data: allTransactions,
    isLoading: isFetchingTransactions,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", transactionsQuery],
    queryFn: () => getTransactions(transactionsQuery),
  });

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setTransactionsQuery((prev) => ({ ...prev, search: value, page: 1 }));
    }, 400),
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "search") {
      debouncedSetSearch(value);
    } else {
      setTransactionsQuery((prev) => ({
        ...prev,
        [name]: name === "limit" || name === "page" ? Number(value) : value,
        page: ["type", "dateRange", "limit"].includes(name) ? 1 : prev.page,
      }));
    }
  };

  const handleExport = () => {
    if (!allTransactions) return;
    // Simulate export functionality
    const csvContent = [
      ["Date", "User", "Type", "Amount", "Balance After", "Reference"],
      ...allTransactions?.transactions?.map((t) => [
        formatDate(t.createdAt),
        t.user?.businessName || t.user?.fullName,
        t.type,
        t.amount,
        t.balanceAfter,
        t.reference,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const handlePageChange = (page: number | ((prev: number) => number)) => {
    if (!allTransactions?.total) return;
    setTransactionsQuery((prev) => {
      const nextPage = typeof page === "function" ? page(prev.page ?? 1) : page;

      const totalPages = Math.ceil(
        allTransactions?.total / transactionsQuery.limit
      );

      return {
        ...prev,
        page: Math.max(1, Math.min(totalPages, nextPage)),
      };
    });
  };

  return {
    allTransactions,
    isFetchingTransactions,
    error,
    refetch,
    transactionsQuery,
    handleInputChange,
    handleExport,
    setTransactionsQuery,
    handlePageChange,
  };
}
