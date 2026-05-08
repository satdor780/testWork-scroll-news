import { Colors } from "@/constants/theme";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type ButtonLayoutProps = React.ComponentProps<typeof Pressable> & {
  text?: string;
  children?: React.ReactNode;
  type?: "button" | "load";
  loaderColor?: string;
};

export const Button = ({
  children,
  style,
  onPress,
  disabled,
  type = "button",
  text,
  loaderColor,
  ...rest
}: ButtonLayoutProps) => {
  const isLoading = type === "load";

  return (
    <Pressable
      style={[styles.button, style as ViewStyle]}
      onPress={onPress}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={loaderColor ?? Colors.textSecondary}
        />
      ) : text ? (
        <Text style={styles.buttonText}>{text}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 16,
    color: Colors.defaultColor,
  },
});
