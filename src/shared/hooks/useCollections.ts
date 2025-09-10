import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import upsertCollection from "../lib/upsertCollection";
import getAllCollections from "../lib/getAllCollections";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function useCollections() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: getAllCollections,
  });

  const favoriteMutation = useMutation({
    mutationFn: upsertCollection,
    onMutate: async (newFav) => {
      await queryClient.cancelQueries({ queryKey: ["collections"] });
      const prevCollections = queryClient.getQueryData<any[]>(["collections"]);
      queryClient.setQueryData<any[]>(["collections"], (old = []) => {
        const exists = old.find((c) => c.refId === newFav.refId);
        if (exists) {
          return old.filter((c) => c.refId !== newFav.refId);
        }
        return [...old, newFav];
      });
      return { prevCollections };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },

    onError: (_err, _newFav, context) => {
      if (context?.prevCollections) {
        queryClient.setQueryData(["collections"], context.prevCollections);
      }
    },
  });

  const toggleFavorite = ({
    refId,
    type,
  }: {
    refId: string;
    type: "wishlist" | "favorite";
  }) => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
    favoriteMutation.mutate({ refId, type });
  };

  return { toggleFavorite, collections };
}
