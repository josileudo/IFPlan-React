import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { theme } from "@/utils/theme";
import { useLoading } from "@/contexts/LoadingContext";

export const Loading = () => {
  const { isLoading } = useLoading();

  return (
    <Modal visible={isLoading} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.title}>Carregando...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
});
