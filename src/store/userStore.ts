
import { create } from 'zustand';
import { AnyUser } from '../../types';


type UserState = {
    user: AnyUser | null;
    setUser: (user: AnyUser) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));
