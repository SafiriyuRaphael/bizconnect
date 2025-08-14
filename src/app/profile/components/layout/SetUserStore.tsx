"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useEditProfileStore } from "@/store/useEditProfileStore";

export default function UserInitializer({ user }: { user: any }) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    useEditProfileStore.getState().setProfile(user);
    setUser(user);
  }, [user, setUser]);

  return null;
}
