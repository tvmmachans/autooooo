import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export const useThemeStore = create()(persist((set, get) => {
    // Detect system theme
    const getSystemTheme = () => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }
        return 'light';
    };
    const updateResolvedTheme = () => {
        const { theme } = get();
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        set({ resolvedTheme: resolved });
        if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(resolved);
        }
    };
    // Listen to system theme changes
    if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateResolvedTheme);
    }
    return {
        theme: 'system',
        resolvedTheme: getSystemTheme(),
        setTheme: (theme) => {
            set({ theme });
            updateResolvedTheme();
        },
    };
}, {
    name: 'theme-storage',
    storage: createJSONStorage(() => localStorage),
}));
//# sourceMappingURL=themeStore.js.map