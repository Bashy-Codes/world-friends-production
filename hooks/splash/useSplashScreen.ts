import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

interface UseSplashScreenOptions {
  minDisplayTime?: number;
  autoHide?: boolean;
}

export const useSplashScreen = (options: UseSplashScreenOptions = {}) => {
  const { minDisplayTime = 2000, autoHide = true } = options;
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Keep splash screen visible
        await SplashScreen.preventAutoHideAsync();

        // Simulate app initialization
        // You can add your actual initialization logic here:
        // - Load fonts
        // - Load cached data
        // - Initialize services
        // - Check authentication state

        // Wait for minimum display time
        await new Promise(resolve => setTimeout(resolve, minDisplayTime));

        setIsAppReady(true);
      } catch (error) {
        console.warn('Error during app initialization:', error);
        setIsAppReady(true);
      }
    };

    initializeApp();
  }, [minDisplayTime]);

  useEffect(() => {
    if (isAppReady && autoHide) {
      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
          setIsSplashComplete(true);
        } catch (error) {
          console.warn('Error hiding splash screen:', error);
          setIsSplashComplete(true);
        }
      };

      hideSplash();
    }
  }, [isAppReady, autoHide]);

  const hideSplashScreen = async () => {
    try {
      await SplashScreen.hideAsync();
      setIsSplashComplete(true);
    } catch (error) {
      console.warn('Error hiding splash screen:', error);
      setIsSplashComplete(true);
    }
  };

  return {
    isAppReady,
    isSplashComplete,
    hideSplashScreen,
  };
};
