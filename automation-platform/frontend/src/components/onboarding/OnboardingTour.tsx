import React from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { useUIStore } from '../../store/uiStore';

const steps: Step[] = [
  {
    target: 'body',
    content: 'Welcome to Automation Platform! Let\'s take a quick tour.',
    placement: 'center',
  },
  {
    target: '[data-tour="sidebar"]',
    content: 'This is your navigation sidebar. Access all features from here.',
  },
  {
    target: '[data-tour="workflow"]',
    content: 'Create and manage your automation workflows here.',
  },
  {
    target: '[data-tour="ai-studio"]',
    content: 'Generate AI content in multiple languages including Malayalam.',
  },
  {
    target: '[data-tour="command-palette"]',
    content: 'Press ⌘K (or Ctrl+K) to open the command palette for quick navigation.',
  },
];

export const OnboardingTour: React.FC = () => {
  const { onboardingComplete, setOnboardingComplete } = useUIStore();
  const [run, setRun] = React.useState(!onboardingComplete);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setOnboardingComplete(true);
    }
  };

  if (onboardingComplete) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          zIndex: 10000,
        },
      }}
    />
  );
};

