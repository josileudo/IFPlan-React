import { useStore } from "@/store/useStore";
import { exportCsvAndShare } from "@/utils/exportCSV";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

export default function Layout() {
  const { clearSimulations, getSimulation, simulations } = useStore();
  const { id } = useGlobalSearchParams();

  const handleClearSimulations = () => {
    Alert.alert(
      "Exluir tudo",
      "Tem certeza que deseja excluir todas as simulações?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => clearSimulations(),
          style: "destructive",
        },
      ]
    );
  };

  const handleExport = async () => {
    if (typeof id !== "string") return;
    const simulation = getSimulation(id);

    if (!simulation) {
      Alert.alert("Erro", "Simulação não encontrada para exportação.");
      return;
    }

    const flattened = {
      id: simulation.id,
      name: simulation.name,
      description: simulation.description,
      date: simulation.date,
      ...simulation.inputs,
      ...simulation.results,
    };

    try {
      await exportCsvAndShare(
        [flattened],
        `simulacao-${simulation.name || "sem-nome"}.csv`
      );
    } catch (error) {
      Alert.alert("Erro", "Falha ao exportar CSV.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#059669",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#F9FAFB",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dashboard/index"
          options={{
            title: "Minhas Simulações",
            headerLargeTitle: Platform.OS !== "ios",
            headerRight: () =>
              simulations.length > 0 && (
                <TouchableOpacity onPress={handleClearSimulations}>
                  <Text style={{ color: "#DC0000", fontWeight: "bold" }}>
                    Limpar tudo
                  </Text>
                </TouchableOpacity>
              ),
          }}
        />
        <Stack.Screen
          name="simulation/index"
          options={{
            title: "Nova Simulação",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="result/[id]"
          options={{
            title: "Resultados",
            headerRight: () => (
              <TouchableOpacity onPress={handleExport}>
                <MaterialIcons name="share" size={24} color="#059669" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="privacyPolicy/index"
          options={{ title: "Política de Privacidade" }}
        />
      </Stack>
    </View>
  );
}
