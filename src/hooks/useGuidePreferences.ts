import { useCallback, useState } from 'react';
import { GUIDE_STORAGE_VERSION } from '../constants/guideSteps';

const BANNER_KEY = `playalibre:guide-banner-dismissed:${GUIDE_STORAGE_VERSION}`;
const TOUR_KEY = `playalibre:onboarding-tour:${GUIDE_STORAGE_VERSION}`;

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function writeFlag(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? 'true' : 'false');
  } catch {
    // Private browsing or storage disabled
  }
}

export function useGuidePreferences() {
  const [bannerDismissed, setBannerDismissed] = useState(() => readFlag(BANNER_KEY));
  const [tourCompleted, setTourCompleted] = useState(() => readFlag(TOUR_KEY));

  const dismissBanner = useCallback(() => {
    writeFlag(BANNER_KEY, true);
    setBannerDismissed(true);
  }, []);

  const completeTour = useCallback(() => {
    writeFlag(TOUR_KEY, true);
    setTourCompleted(true);
  }, []);

  const skipTour = useCallback(() => {
    writeFlag(TOUR_KEY, true);
    setTourCompleted(true);
  }, []);

  return {
    bannerDismissed,
    tourCompleted,
    dismissBanner,
    completeTour,
    skipTour,
  };
}
