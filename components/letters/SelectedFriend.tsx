import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "react-i18next";
import { ProfilePicture } from "@/components/common/TinyProfilePicture";
import { getCountryByCode } from "@/constants/geographics";
import { Id } from "@/convex/_generated/dataModel";

interface Friend {
  userId: Id<"users">;
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  isAdmin?: boolean;
  isSupporter?: boolean;
}

interface SelectedFriendProps {
  friend: Friend;
  onRemove: () => void;
}

export const SelectedFriend: React.FC<SelectedFriendProps> = ({
  friend,
  onRemove,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const country = getCountryByCode(friend.country);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(16),
      marginVertical: verticalScale(8),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    contentContainer: {
      flex: 1,
      marginLeft: scale(16),
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(4),
    },
    name: {
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.text,
      marginRight: scale(8),
    },
    adminBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(2),
      borderRadius: scale(theme.borderRadius.sm),
      marginRight: scale(4),
    },
    supporterBadge: {
      marginRight: scale(4),
    },
    adminText: {
      fontSize: moderateScale(10),
      color: theme.colors.white,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    details: {
      flexDirection: "row",
      alignItems: "center",
    },
    detailsText: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
    },
    removeButton: {
      padding: scale(8),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.error,
      marginLeft: scale(12),
    },
  });

  return (
    <View style={styles.container}>
      <ProfilePicture
        profilePicture={friend.profilePicture}
        size={50}
      />

      <View style={styles.contentContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {friend.name}
          </Text>

          {friend.isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>Admin</Text>
            </View>
          )}

          {friend.isSupporter && (
            <View style={styles.supporterBadge}>
              <Text style={{ fontSize: moderateScale(12) }}>❤️</Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.detailsText}>
            {friend.gender === "female" ? "👩" : friend.gender === "male" ? "👨" : "👤"} • {friend.age} • {country?.flag} {country?.name}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        activeOpacity={0.7}
      >
        <Ionicons
          name="close"
          size={scale(16)}
          color={theme.colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};
