import { create } from "zustand";

interface userStore {
    accessToken: string,//refreshToken在cookie中
    setAccessToken: (newToken: string) => void,
}

const useUserStore = create<userStore>((set) => {
    return {
        accessToken: "",
        setAccessToken: (newToken: string) => {
            set({ accessToken: newToken })
            localStorage.setItem("accessToken", newToken);
            // 写法 B：如果你需要用到老状态（比如计数器），也可以简写
            // set((state) => ({ accessToken: newToken }))
        },
    }
})

export default useUserStore;