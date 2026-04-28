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
import { useState, useMemo } from "react";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const greetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌄";
    if (hour < 18) return "☀️";
    return "🌙";
  };

  const lastUpdate = useMemo(() => {
    if (simulations.length === 0) return "Nenhuma";
    const sorted = [...simulations].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return new Date(sorted[0].date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short"
    });
  }, [simulations]);

  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <View style={styles.statsContainer}>
        <Text style={[styles.statText, { color: colors.text.secondary }]}>
          {simulations.length} {simulations.length === 1 ? 'simulação' : 'simulações'} • Atualizado em {lastUpdate}
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
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
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearSearchButton}>
              <MaterialIcons name="close" size={20} color={colors.text.placeholder} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity 
        style={styles.footerButton}
        onPress={() => router.push("/privacyPolicy")}
      >
        <MaterialIcons name="lock-outline" size={16} color={colors.text.placeholder} />
        <Text style={[styles.footerText, { color: colors.text.placeholder }]}>Política de Privacidade</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16), paddingHorizontal: spacing.md }]}>
        <View>
          <Text style={[styles.greetingSubtitle, { color: colors.text.secondary }]}>
            {getGreeting()}, Produtor {greetingIcon()}
          </Text>
          <Text style={[styles.greetingTitle, { color: colors.text.primary }]}>
            IFPlan Leite
          </Text>
        </View>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialIcons name="agriculture" size={24} color={colors.primary} />
        </View>
      </View>

      <FlatList
        data={filteredSimulations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.md }]}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={simulations.length > 0 ? ListFooter : null}
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
            <View style={[styles.emptyIconContainer, { backgroundColor: colors.surface }]}>
              <MaterialIcons name="folder-open" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>Nenhuma simulação</Text>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              {searchQuery ? "Nenhuma simulação encontrada com essa busca." : "Crie sua primeira simulação para começar a planejar."}
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={[styles.emptyButton, { backgroundColor: colors.primary, borderRadius: borderRadius.md }]}
                onPress={() => router.push("/simulation")}
              >
                <Text style={styles.emptyButtonText}>Nova Simulação</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <View style={[styles.fabContainer, { bottom: Math.max(insets.bottom, 16) + 16 }]}>
        <AnimatedButton
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/simulation")}
        >
          <MaterialIcons name="add" size={32} color={"#fff"} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  greetingSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  listHeaderContainer: {
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    fontWeight: "500",
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearSearchButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 48,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
  },
  fabContainer: {
    position: "absolute",
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

