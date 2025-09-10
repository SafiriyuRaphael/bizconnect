"use client";

import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useMessageModalStore } from "@/shared/store/useMessageModalStore";

interface AuthRedirectError extends Error {
  status: number;
  redirectTo?: string;
}

interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export default function QueryErrorHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { onOpen } = useMessageModalStore();

  // Create QueryClient on the client side
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
          mutations: {},
        },
      }),
    []
  );

  useEffect(() => {
    // Handle query errors
    const queryUnsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.query.state.error) {
        const error = event.query.state.error as AuthRedirectError | ApiError;
        if (
          error.name === "AuthRedirectError" &&
          "redirectTo" in error &&
          error.redirectTo
        ) {
          router.push(error.redirectTo);
        } else {
          // Display non-redirect errors in MessageModal
          onOpen({
            title: "Error",
            message: error.message || "An unexpected error occurred",
            type: "error",
            autoClose: true,
            autoCloseDelay: 5000,
            closable: true,
            showIcon: true,
            actions: null,
          });
        }
      }
    });

    // Handle mutation errors
    const mutationUnsubscribe = queryClient
      .getMutationCache()
      .subscribe((event) => {
        if (
          event.type === "updated" &&
          event.mutation.state.status === "error"
        ) {
          const error = event.mutation.state.error as
            | AuthRedirectError
            | ApiError;
          if (
            error.name === "AuthRedirectError" &&
            "redirectTo" in error &&
            error.redirectTo
          ) {
            router.push(error.redirectTo);
          } else {
            // Display non-redirect errors in MessageModal
            onOpen({
              title: "Error",
              message:
                (error as ApiError)?.data &&
                typeof (error as ApiError).data === "object"
                  ? (error as any).data?.message || error.message
                  : error.message || "An unexpected error occurred",
              type: "error",
              autoClose: true,
              autoCloseDelay: 5000,
              closable: true,
              showIcon: true,
              actions: null,
            });
          }
        }
      });

    // Cleanup subscriptions
    return () => {
      queryUnsubscribe();
      mutationUnsubscribe();
    };
  }, [queryClient, router, onOpen]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
