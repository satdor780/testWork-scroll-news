import { Colors } from "@/constants/theme";
import { useLikePost } from "@/hooks";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ButtonLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

interface LikeProps {
  count?: number;
  liked?: boolean;
  postId: string;
  onPress?: () => void;
}

interface CommentButtonProps {
  count?: number;
  onPress?: () => void;
}

// ─── Components ──────────────────────────────────────────────────────────────

const ButtonLayout = ({
  children,
  style,
  onPress,
  disabled,
}: ButtonLayoutProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
};

export const LikeButton = ({
  count = 0,
  liked = false,
  postId,
  onPress,
}: LikeProps) => {
  const { mutate: toggleLike, isPending } = useLikePost();
  const scale = useRef(new Animated.Value(1)).current;

  const animateLike = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.4,
        useNativeDriver: true,
        speed: 50,
        bounciness: 10,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 15,
      }),
    ]).start();
  };

  const handlePress = () => {
    animateLike();
    toggleLike({ postId, currentIsLiked: liked });
    onPress?.();
  };

  return (
    <ButtonLayout
      onPress={handlePress}
      disabled={isPending}
      style={liked ? styles.activeLikeButton : undefined}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <FontAwesome5
          name="heart"
          size={15}
          color={liked ? "white" : Colors.textSecondary}
        />
      </Animated.View>
      <Text style={[styles.buttonText, liked && styles.buttonTextActive]}>
        {count}
      </Text>
    </ButtonLayout>
  );
};

export const CommentButton = ({ count = 0, onPress }: CommentButtonProps) => {
  return (
    <ButtonLayout onPress={onPress}>
      <FontAwesome5
        name="comment"
        size={15}
        color={Colors.textSecondary}
        solid
      />
      <Text style={styles.buttonText}>{count}</Text>
    </ButtonLayout>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.buttonsBackground,
    height: 36,
    paddingHorizontal: 10.5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    overflow: "hidden",
    gap: 8.5,
    alignSelf: "flex-start",
  },
  activeLikeButton: {
    backgroundColor: Colors.pink,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  buttonTextActive: {
    color: "white",
  },
});
