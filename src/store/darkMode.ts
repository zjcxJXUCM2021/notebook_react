import { create } from "zustand";

interface isDark {
    isDark: boolean,
    updateDark: () => void,
    setDark: (state: boolean) => void
}

const useDarkStore = create((set): isDark => {
    return {
        isDark: false,
        updateDark: (): void => {
            set((state: isDark) => {
                console.log("全局变量由", state.isDark, !state.isDark);
                localStorage.setItem("isDark", String(!state.isDark));
                return {
                    isDark: !state.isDark
                }
            })
        },
        setDark: (state): void => {
            set({ isDark: state });
            localStorage.setItem("isDark", String(state));
        }
    }
})
export default useDarkStore;
