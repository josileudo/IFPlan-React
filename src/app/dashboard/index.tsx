import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useTheme } from "@/utils/theme";
import { useRouter } from "expo-router";
import { useStore } from "../../store/useStore";
import { Card } from "../../components/Card";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const router = useRouter();
  const { colors, spacing, typography, borderRadius, isDark } = useTheme();
  const simulations = useStore((state) => state.simulations);
  const deleteSimulation = useStore((state) => state.deleteSimulation);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

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

  const filteredSimulations = simulations.filter(sim => 
    sim.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sim.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.surface }]}
          onPress={() => {
            router.push("/privacyPolicy");
          }}
        >
          <Text style={[styles.headerButtonText, { color: colors.text.primary }]}>Política de Privacidade</Text>
          <MaterialIcons name="arrow-right" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { paddingHorizontal: spacing.md }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md }]}>
          <MaterialIcons name="search" size={20} color={colors.text.placeholder} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Buscar simulação..."
            placeholderTextColor={colors.text.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={20} color={colors.text.placeholder} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredSimulations}
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
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>Nenhuma simulação</Text>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              {searchQuery ? "Nenhuma simulação encontrada com essa busca." : "Crie sua primeira simulação para começar a planejar."}
            </Text>
          </View>
        }
      />

      <View style={[styles.fabContainer, { bottom: Math.max(insets.bottom, 16) + 16 }]}>
        <AnimatedButton
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/simulation")}
        >
          <MaterialIcons name="add" size={32} color={colors.surface} />
        </AnimatedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
  },
  headerButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  searchContainer: {
    marginVertical: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    padding: 8,
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
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 16,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
