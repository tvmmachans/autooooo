import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatedLayout } from './components/layout/AnimatedLayout';
import { GlassSidebar } from './components/layout/GlassSidebar';
import { CommandPalette } from './components/layout/CommandPalette';
import { useThemeStore } from './store/themeStore';
import { Dashboard } from './pages/Dashboard';
import { Workflows } from './pages/Workflows';
import { AIStudio } from './pages/AIStudio';
import { VideoStudio } from './pages/VideoStudio';
import { Trends } from './pages/Trends';
import { Settings } from './pages/Settings';
import { OnboardingTour } from './components/onboarding/OnboardingTour';
const queryClient = new QueryClient();
function App() {
    const { resolvedTheme } = useThemeStore();
    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolvedTheme);
    }, [resolvedTheme]);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300", children: [_jsx(GlassSidebar, {}), _jsx("div", { className: "lg:pl-64", children: _jsx(AnimatedLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/workflows", element: _jsx(Workflows, {}) }), _jsx(Route, { path: "/ai-studio", element: _jsx(AIStudio, {}) }), _jsx(Route, { path: "/video-studio", element: _jsx(VideoStudio, {}) }), _jsx(Route, { path: "/trends", element: _jsx(Trends, {}) }), _jsx(Route, { path: "/settings/*", element: _jsx(Settings, {}) })] }) }) }), _jsx(CommandPalette, {}), _jsx(OnboardingTour, {})] }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map