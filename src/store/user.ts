import { create } from "zustand";

interface userStore {
    accessToken: string,//refreshToken在cookie中
    role: string,
    setAccessToken: (newToken: string) => void,
    setRole: (newRole: string) => void,
    logout: () => void
}

const useUserStore = create<userStore>((set) => {
    return {
        accessToken: "",
        role: "",
        setAccessToken: (newToken: string) => {
            set({ accessToken: newToken })
            localStorage.setItem("accessToken", newToken);
        },
        setRole: (newRole: string) => {
            set({ role: newRole });
            localStorage.setItem("role", newRole);
        },
        logout: () => {
            localStorage.removeItem('role');
            localStorage.removeItem('accessToken');
            set({ accessToken: "", role: "" });
        }
    }
})

export default useUserStore;