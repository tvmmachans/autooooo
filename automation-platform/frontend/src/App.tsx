import React, { useEffect } from 'react';
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
import { OnboardingTour } from './components/onboarding/OnboardingTour';

const queryClient = new QueryClient();

function App() {
  const { resolvedTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
          <GlassSidebar />
          <div className="lg:pl-64">
            <AnimatedLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workflows" element={<Workflows />} />
                <Route path="/ai-studio" element={<AIStudio />} />
                <Route path="/video-studio" element={<VideoStudio />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/settings" element={
                  <div className="p-8">
                    <h1 className="text-4xl font-bold mb-4">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400">Settings page coming soon...</p>
                  </div>
                } />
              </Routes>
            </AnimatedLayout>
          </div>
          <CommandPalette />
          <OnboardingTour />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

