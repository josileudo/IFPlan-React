import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useStore } from "../../store/useStore";
import { Card } from "../../components/Card";

export default function Dashboard() {
  const router = useRouter();
  const simulations = useStore((state) => state.simulations);

  // Re-render when simulations change is automatic with Zustand selector

  return (
    <View style={styles.container}>
      <FlatList
        data={simulations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card
            title={item.name || "Simulação Sem Título"} // Fallback, though we should enforce name
            description={item.description}
            date={item.date}
            onPress={() => router.push(`/result/${item.id}`)}
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
    backgroundColor: "#F9FAFB",
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: 32,
    right: 24,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    marginTop: -4, // visual alignment
    fontWeight: "400",
  },
});
