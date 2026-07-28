import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Dimensions } from "react-native";
import { useToast, ToastType } from "@/contexts/ToastContext";
import { useTheme } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export const Toast = () => {
  const { toast } = useToast();
  const { colors, spacing, borderRadius, typography, shadows } = useTheme();
  const [show, setShow] = React.useState(toast.visible);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (toast.visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 50,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShow(false);
      });
    }
  }, [toast.visible, opacity, translateY]);

  if (!show) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "error";
      case "alert":
        return "warning";
      case "info":
      default:
        return "info";
    }
  };

  const getBackgroundColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return colors.success;
      case "error":
        return colors.error;
      case "alert":
        return colors.warning;
      case "info":
      default:
        return colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: getBackgroundColor(toast.type),
          padding: spacing.md,
          borderRadius: borderRadius.md,
          ...shadows.md,
        },
      ]}
    >
      <MaterialIcons name={getIcon(toast.type)} size={24} color="#FFF" />
      <Text style={[styles.message, { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, marginLeft: spacing.sm }]}>
        {toast.message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
  },
  message: {
    color: "#FFF",
    flex: 1,
  },
});
