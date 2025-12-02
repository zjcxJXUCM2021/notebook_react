import { create } from "zustand";

interface userStore {
    accessToken: string,//refreshToken在cookie中
    role: string,
    setAccessToken: (newToken: string) => void,
    setRole: (newRole: string) => void,
}

const useUserStore = create<userStore>((set) => {
    return {
        accessToken: "",
        role: "",
        setAccessToken: (newToken: string) => {
            set({ accessToken: newToken })
            // 写法 B：如果你需要用到老状态（比如计数器），也可以简写
            // set((state) => ({ accessToken: newToken }))
        },
        setRole: (newRole: string) => {
            set({ role: newRole });
        }
    }
})

export default useUserStore;