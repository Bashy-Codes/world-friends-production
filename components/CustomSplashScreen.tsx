import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useTheme } from "@/lib/Theme";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

interface CustomSplashScreenProps {
  isReady: boolean;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  isReady,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    if (isReady) {
      // Fade out animation before hiding splash screen
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [isReady, fadeAnim, scaleAnim]);

  if (isReady) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Logo Container */}
      <View
        style={[
          styles.logoContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* App Name */}
      <Text style={[styles.appName, { color: theme.colors.text }]}>
        WorldFriends
      </Text>

      {/* Loading Indicator */}
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={styles.activityIndicator}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  logoContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: scale(80),
    height: scale(80),
  },
  appName: {
    fontSize: moderateScale(32),
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  activityIndicator: {
    marginTop: verticalScale(20),
  },
});
