import { create } from "zustand";

interface userStore {
    accessToken: string,//refreshToken在cookie中
    role: string,
    isLoading: boolean,
    setAccessToken: (newToken: string) => void,
    setRole: (newRole: string) => void,
    logout: () => void,
    setIsLoading: (newState: boolean) => void
}

const useUserStore = create<userStore>((set) => {
    return {
        accessToken: "",
        role: "",
        isLoading: true,
        setAccessToken: (newToken: string) => {
            localStorage.setItem("accessToken", newToken);
            set({ accessToken: newToken, });
        },
        setRole: (newRole: string) => {
            set({ role: newRole });
            localStorage.setItem("role", newRole);
        },
        logout: () => {
            localStorage.removeItem('role');
            localStorage.removeItem('accessToken');
            set({ accessToken: "", role: "" });
        },
        setIsLoading: (newState: boolean) => {
            set({ isLoading: newState });
        }
    }
})

export default useUserStore;