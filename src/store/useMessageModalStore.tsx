import { create } from "zustand";

type MessageModalStore = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "error" | "warning" | "info" | "success";
  actions: React.ReactNode | null;
  autoClose: boolean;
  autoCloseDelay: number;
  showIcon: boolean;
  closable: boolean;
  onOpen: (payload: Partial<MessageModalStore>) => void;
};

import React from "react";

export const useMessageModalStore = create<MessageModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  title: "",
  message: "",
  type: "info",
  actions: null,
  autoClose: true,
  autoCloseDelay: 3000,
  showIcon: true,
  closable: true,
  onOpen: (payload) =>
    set({
      ...payload,
      isOpen: true,
    }),
}));
