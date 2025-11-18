import { create } from 'zustand';
export const useUIStore = create((set) => ({
    sidebarOpen: true,
    commandPaletteOpen: false,
    onboardingComplete: false,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
}));
//# sourceMappingURL=uiStore.js.map