import React, { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useConvexAuth } from "convex/react";
import { FlashList } from "@shopify/flash-list";
import { EmptyState } from "@/components/EmptyState";
import { ProfilePicture } from "@/components/common/TinyProfilePicture";
import { getCountryByCode } from "@/constants/geographics";
import { Button } from "../ui/Button";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

interface FriendsPickerModalProps {
  onFriendSelect: (friend: Friend) => void;
}

export interface FriendsPickerModalRef {
  present: () => void;
  dismiss: () => void;
}

const FriendItem: React.FC<{
  friend: Friend;
  onPress: () => void;
  t: (key: string) => string;
}> = ({ friend, onPress, t }) => {
  const theme = useTheme();
  const country = getCountryByCode(friend.country);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scale(24),
      paddingVertical: verticalScale(20),
      backgroundColor: theme.colors.surface,
      marginHorizontal: scale(16),
      marginVertical: verticalScale(4),
      borderRadius: scale(theme.borderRadius.lg),
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
    name: {
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(4),
    },
    details: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      flexDirection: "row",
      alignItems: "center",
    },
    detailsText: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ProfilePicture
        profilePicture={friend.profilePicture}
        size={50}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {friend.name}
        </Text>
        <View style={styles.details}>
          <Text style={styles.detailsText}>
            {friend.gender === "female" ? "👩" : friend.gender === "male" ? "👨" : "👤"} • {friend.age} • {country?.flag} {country?.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const FriendsPickerModal = forwardRef<FriendsPickerModalRef, FriendsPickerModalProps>(
  ({ onFriendSelect }, ref) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { isAuthenticated } = useConvexAuth();

    // State
    const [visible, setVisible] = useState(false);

    // Get current user's friends with pagination
    const {
      results: friends,
      status,
      loadMore,
    } = usePaginatedQuery(
      api.friendships.getUserFriends,
      visible && isAuthenticated ? {} : "skip",
      { initialNumItems: 20 }
    );

    const areFriendsLoading = status === "LoadingFirstPage";

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      present: () => {
        setVisible(true);
      },
      dismiss: () => {
        setVisible(false);
      },
    }), []);

    // Load more friends
    const handleLoadMore = useCallback(() => {
      if (status === "CanLoadMore") {
        loadMore(20);
      }
    }, [status, loadMore]);

    // Handle friend selection and dismiss the Modal
    const handleFriendPress = useCallback((friend: Friend) => {
      onFriendSelect(friend);
      setVisible(false);
    }, [onFriendSelect]);

    // Handle close
    const handleClose = useCallback(() => {
      setVisible(false);
    }, []);

    const renderFriendItem = useCallback(
      ({ item }: { item: Friend }) => (
        <FriendItem
          friend={item}
          onPress={() => handleFriendPress(item)}
          t={t}
        />
      ),
      [handleFriendPress, t]
    );

    const renderLoader = () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );

    const renderEmptyState = () => (
      <EmptyState style={{ flex: 1, minHeight: verticalScale(300) }} />
    );

    const styles = StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      container: {
        backgroundColor: theme.colors.background,
        width: screenWidth * 0.9,
        height: screenHeight * 0.8,
        maxWidth: scale(500),
        maxHeight: scale(700),
        borderRadius: scale(theme.borderRadius.xl),
        shadowColor: theme.colors.shadow,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
        overflow: 'hidden',
      },
      content: {
        flex: 1,
        paddingTop: verticalScale(8),
      },
      actionsContainer: {
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(16),
        backgroundColor: theme.colors.surface,
        borderRadius: scale(theme.borderRadius.xl),
      },
      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    });

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Content */}
            <View style={styles.content}>
              {areFriendsLoading ?
                renderLoader() :
                <FlashList
                  data={friends}
                  keyExtractor={(item) => item.userId}
                  renderItem={renderFriendItem}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.5}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={renderEmptyState}
                  contentContainerStyle={{
                    paddingVertical: verticalScale(8),
                  }}
                />}
            </View>

            {/* Close Button */}
            <View style={styles.actionsContainer}>
              <Button
                iconName="close"
                onPress={handleClose}
                bgColor={theme.colors.error}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

FriendsPickerModal.displayName = "FriendsPickerModal";
