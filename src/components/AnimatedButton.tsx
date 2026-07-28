import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback, StyleSheet, ViewStyle, Text, TextStyle, View } from "react-native";
import { useTheme } from "../utils/theme";
import { MaterialIcons } from "@expo/vector-icons";

interface AnimatedButtonProps {
  onPress: () => void;
  title?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconSide?: "left" | "right";
  type?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  children?: React.ReactNode;
}

export function AnimatedButton({
  onPress,
  title,
  style,
  textStyle,
  icon,
  iconSide = "left",
  type = "primary",
  disabled = false,
  children,
}: AnimatedButtonProps) {
  const { colors } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
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
    if (disabled) return;
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
    if (disabled) return colors.disabled;
    switch (type) {
      case "primary":
        return colors.primary;
      case "secondary":
        return "transparent";
      case "danger":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.placeholder;
    switch (type) {
      case "primary":
      case "danger":
        return colors.text.light;
      case "secondary":
        return colors.primary;
      default:
        return colors.text.light;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: getBackgroundColor(),
            transform: [{ scale: scaleValue }],
            opacity: disabled ? 0.6 : opacityValue,
          },
          type === "secondary" && {
            borderWidth: 1,
            borderColor: disabled ? colors.disabled : colors.primary,
          },
          style,
        ]}
      >
        <View style={styles.content}>
          {icon && iconSide === "left" && (
            <MaterialIcons name={icon} size={20} color={getTextColor()} style={{ marginRight: title ? 8 : 0 }} />
          )}
          {title && (
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
              {title}
            </Text>
          )}
          {children}
          {icon && iconSide === "right" && (
            <MaterialIcons name={icon} size={20} color={getTextColor()} style={{ marginLeft: title ? 8 : 0 }} />
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
