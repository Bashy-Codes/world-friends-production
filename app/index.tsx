import "react-native-reanimated";
import "react-native-gesture-handler";

import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { Redirect } from "expo-router";
import { CustomSplashScreen } from "@/components/CustomSplashScreen";
import { useSplashScreen } from "@/hooks/splash";

export default function Index() {
  const { isAppReady, isSplashComplete } = useSplashScreen({
    minDisplayTime: 2000,
    autoHide: true,
  });

  return (
    <>
      <CustomSplashScreen isReady={isAppReady} />

      {isAppReady && (
        <>
          <AuthLoading>
            <CustomSplashScreen isReady={false} />
          </AuthLoading>

          <Unauthenticated>
            <Redirect href="/(auth)" />
          </Unauthenticated>

          <Authenticated>
            <Redirect href="/(tabs)" />
          </Authenticated>
        </>
      )}
    </>
  );
}