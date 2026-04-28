import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacityProps,
  View,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme";
import { useMemo, useRef } from "react";

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
  const { colors } = useTheme();

  const isDisabled = useMemo(
    () => isProcessing || rest.disabled,
    [isProcessing, rest.disabled],
  );

  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (isDisabled) return;
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (isDisabled) return;
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getBackgroundColor = () => {
    if (isDisabled) return colors.disabled;
    if (type === "secondary") return colors.surface;
    return colors.primary;
  };

  const getTextColor = () => {
    if (isDisabled) return colors.text.secondary;
    if (type === "secondary") return colors.primary;
    return colors.text.light;
  };

  return (
    <TouchableWithoutFeedback
      onPress={isDisabled ? undefined : rest.onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: getBackgroundColor(),
            transform: [{ scale: scaleValue }],
            opacity: isDisabled ? 0.7 : opacityValue,
          },
          type === "secondary" && {
            borderWidth: 1,
            borderColor: isDisabled ? colors.border : colors.primary,
          },
          rest.style,
        ]}
      >
        <View style={styles.content}>
          {iconSide === "left" && icon && (
            <MaterialIcons
              name={icon}
              size={24}
              color={getTextColor()}
              style={{ position: "absolute", left: 16, zIndex: 1 }}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), textAlign: "center" },
            ]}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={getTextColor()} />
            ) : (
              title
            )}
          </Text>
          {iconSide === "right" && icon && (
            <MaterialIcons
              name={icon}
              size={24}
              color={getTextColor()}
              style={{ position: "absolute", right: 16, zIndex: 1 }}
            />
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
