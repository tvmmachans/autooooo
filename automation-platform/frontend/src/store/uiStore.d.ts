interface UIState {
    sidebarOpen: boolean;
    commandPaletteOpen: boolean;
    onboardingComplete: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setCommandPaletteOpen: (open: boolean) => void;
    setOnboardingComplete: (complete: boolean) => void;
}
export declare const useUIStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UIState>>;
export {};
//# sourceMappingURL=uiStore.d.ts.map