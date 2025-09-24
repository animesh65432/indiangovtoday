import { create } from "zustand";

type AuthstoreTypes = {
    token: string | null;
    addtoken: (token: string) => void;
    removetoken: () => void;
};

export const getInitialToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export const useAuthstore = create<AuthstoreTypes>((set) => ({
    token: getInitialToken(),
    addtoken: (token) => {
        localStorage.setItem("token", token);
        set({ token });
    },
    removetoken: () => {
        localStorage.removeItem("token");
        set({ token: null });
    }
}));