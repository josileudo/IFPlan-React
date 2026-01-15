import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Dimensions } from "react-native";
import { useToast, ToastType } from "@/contexts/ToastContext";
import { theme } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export const Toast = () => {
  const { toast } = useToast();
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
        return theme.colors.success;
      case "error":
        return theme.colors.error;
      case "alert":
        return theme.colors.warning;
      case "info":
      default:
        return theme.colors.primary;
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
        },
      ]}
    >
      <MaterialIcons name={getIcon(toast.type)} size={24} color="#FFF" />
      <Text style={styles.message}>{toast.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
    ...theme.shadows.md,
  },
  message: {
    color: "#FFF",
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
});
