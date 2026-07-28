import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/utils/theme";
import { useLoading } from "@/contexts/LoadingContext";

export const Loading = () => {
  const { isLoading } = useLoading();
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();

  return (
    <Modal visible={isLoading} transparent animationType="fade">
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: colors.surface, padding: spacing.xl, borderRadius: borderRadius.lg, ...shadows.md }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.title, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.bold as any, marginTop: spacing.md }]}>Carregando...</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
});
