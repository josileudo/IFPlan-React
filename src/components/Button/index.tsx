import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/utils/theme";
import { useMemo } from "react";

type Props = TouchableOpacityProps & {
  title: string;
  isProcessing?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap & string;
  type?: "primary" | "secondary" | "tertiary";
  iconSide?: "left" | "right";
};

export const Button = ({
  title,
  isProcessing = false,
  type = "primary",
  icon,
  iconSide = "left",
  ...rest
}: Props) => {
  const isDisabled = useMemo(
    () => isProcessing || rest.disabled,
    [isProcessing, rest.disabled]
  );

  return (
    <TouchableOpacity
      {...rest}
      style={[
        styles.container,
        rest.style,
        type === "secondary" && styles.secondary,
        isDisabled && styles.disabled,
      ]}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      <View style={styles.content}>
        {iconSide === "left" && icon && (
          <MaterialIcons
            name={icon}
            size={24}
            color={
              type === "secondary"
                ? theme.colors.primary
                : theme.colors.background
            }
          />
        )}
        <Text
          style={[
            styles.text,
            type === "secondary" && styles.textSecondary,
            isDisabled && styles.textDisabled,
          ]}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={theme.colors.background} />
          ) : (
            title
          )}
        </Text>
        {iconSide === "right" && icon && (
          <MaterialIcons
            name={icon}
            size={24}
            color={
              type === "secondary"
                ? theme.colors.primary
                : theme.colors.background
            }
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    height: 48,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 14,
    color: theme.colors.text.light,
    fontWeight: "bold",
  },
  disabled: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.border,
  },
  textDisabled: {
    color: theme.colors.text.secondary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  textSecondary: {
    color: theme.colors.text.secondary,
  },
});
