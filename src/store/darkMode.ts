import { create } from "zustand";

interface isDark {
    isDark: boolean,
    updateDark: () => void,
}

const useDarkStore = create((set): isDark => {
    return {
        isDark: false,
        updateDark: (): void => {
            set((state: isDark) => {
                return {
                    isDark: !state.isDark
                }
            })
        },
    }
})
export default useDarkStore;
