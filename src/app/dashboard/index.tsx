import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { theme } from "@/utils/theme";
import { useRouter } from "expo-router";
import { useStore } from "../../store/useStore";
import { Card } from "../../components/Card";
import { MaterialIcons } from "@expo/vector-icons";

export default function Dashboard() {
  const router = useRouter();
  const simulations = useStore((state) => state.simulations);
  const deleteSimulation = useStore((state) => state.deleteSimulation);

  const handleDelete = (id: string) => {
    Alert.alert("Excluir", "Tem certeza que deseja excluir esta simulação?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancelado"),
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: () => deleteSimulation(id),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            router.push("/privacyPolicy");
          }}
        >
          <Text style={styles.headerButtonText}>Política de Privacidade</Text>
          <MaterialIcons name="arrow-right" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={simulations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card
            title={item.name || "Simulação Sem Título"}
            description={item.description}
            date={item.date}
            onPress={() => router.push(`/result/${item.id}`)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma simulação</Text>
            <Text style={styles.emptyText}>
              Crie sua primeira simulação para começar a planejar.
            </Text>
          </View>
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/simulation")}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    margin: theme.spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
  },
  headerButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  headerButtonText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold as any,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.lg,
  },
  fabText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes["3xl"],
    marginTop: -4, // visual alignment
    fontWeight: theme.typography.weights.regular as any,
  },
});
