import { memo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useMutation } from "convex/react";
import { useTheme } from "@/lib/Theme";
import { getCountryByCode } from "@/constants/geographics";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import AgeGenderChip from "../ui/AgeGenderChip";
import NameContainer from "../ui/NameContainer";
import ProfilePhoto from "../ui/ProfilePhoto";
import Toast from "react-native-toast-message";

interface FriendRequest {
  requestId: Id<"friendRequests">;
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  requestMessage: string;
  senderId: Id<"users">;
  isAdmin?: boolean;
  isSupporter?: boolean;
}

interface FriendRequestCardProps {
  request: FriendRequest;
  onViewProfile?: (userId: Id<"users">) => void;
  onAccepted?: () => void;
  onRejected?: () => void;
}

const FriendRequestCardComponent: React.FC<FriendRequestCardProps> = ({
  request,
  onViewProfile,
  onAccepted,
  onRejected,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const acceptFriendRequest = useMutation(api.friendships.acceptFriendRequest);
  const rejectFriendRequest = useMutation(api.friendships.rejectFriendRequest);

  const country = getCountryByCode(request.country);

  const handleAccept = useCallback(async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await acceptFriendRequest({ requestId: request.requestId });

      onAccepted?.();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError.text1"),
        text2: t("errorToasts.genericError.text2"),
        position: "top",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [acceptFriendRequest, request.requestId, onAccepted, isProcessing, t]);

  const handleReject = useCallback(async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await rejectFriendRequest({ requestId: request.requestId });
      onRejected?.();
    } catch (error) {
      console.error("Failed to reject friend request:", error);
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError.text1"),
        text2: t("errorToasts.genericError.text2"),
        position: "top",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [rejectFriendRequest, request.requestId, onRejected, isProcessing, t]);

  const handleViewProfile = useCallback(() => {
    onViewProfile?.(request.senderId);
  }, [request.senderId, onViewProfile]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(20),
      marginHorizontal: scale(16),
      marginVertical: verticalScale(8),
      alignItems: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    countryContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: verticalScale(12),
    },
    flagEmoji: {
      fontSize: moderateScale(14),
      marginRight: scale(8),
    },
    countryText: {
      fontSize: moderateScale(16),
      color: theme.colors.text,
      fontWeight: "600",
    },
    messageContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: scale(theme.borderRadius.md),
      padding: scale(12),
      marginBottom: verticalScale(16),
      width: "100%",
    },
    messageText: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
      lineHeight: moderateScale(18),
      textAlign: "center",
      fontStyle: "italic",
    },
    buttonsContainer: {
      flexDirection: "row",
      width: "100%",
      gap: scale(12),
    },
  });

  return (
    <TouchableOpacity onPress={handleViewProfile} activeOpacity={0.8} style={styles.card}>
      <ProfilePhoto profilePicture={request.profilePicture} />

      <NameContainer
        name={request.name}
        isAdmin={request.isAdmin}
        isSupporter={request.isSupporter}
      />

      <AgeGenderChip
        size="medium"
        gender={request.gender}
        age={request.age}
      />

      <View style={styles.countryContainer}>
        <Text style={styles.flagEmoji}>{country?.flag}</Text>
        <Text style={styles.countryText}>{country?.name}</Text>
      </View>

      {request.requestMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{request.requestMessage}</Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <Button
          iconName="checkmark"
          onPress={handleAccept}
          disabled={isProcessing}
          bgColor={theme.colors.success}
          style={{ flex: 1 }}
        />
        <Button
          iconName="close"
          onPress={handleReject}
          disabled={isProcessing}
          bgColor={theme.colors.error}
          style={{ flex: 1 }}
        />
      </View>
    </TouchableOpacity>
  );
};

export const FriendRequestCard = memo(FriendRequestCardComponent);
