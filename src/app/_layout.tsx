import { theme } from "@/utils/theme";
import { useStore } from "@/store/useStore";
import { exportPdfAndShare } from "@/utils/exportCSV";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { Simulation } from "@/types";
import { Loading } from "@/components/Loading";
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import { ToastProvider, useToast } from "@/contexts/ToastContext";
import { Toast } from "@/components/Toast";

function LayoutContent() {
  const { clearSimulations, getSimulation, simulations } = useStore();
  const { setIsLoading } = useLoading();
  const { showToast } = useToast();
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
          onPress: () => {
            setIsLoading(true);
            clearSimulations();
            showToast("Todas as simulações foram excluídas", "success");
            setIsLoading(false);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleExport = async () => {
    if (typeof id !== "string") return;
    const simulation = getSimulation(id);

    if (!simulation) {
      showToast("Simulação não encontrada para exportação.", "error");
      return;
    }

    const flattened: Simulation = {
      id: simulation.id,
      name: simulation.name,
      description: simulation.description,
      date: simulation.date,
      inputs: simulation.inputs,
      results: simulation.results,
    };

    try {
      setIsLoading(true);
      await exportPdfAndShare(
        flattened,
        `simulation-${simulation.name || "sem-nome"}.pdf`
      );
      showToast("PDF exportado com sucesso!", "success");
    } catch (error) {
      showToast("Falha ao exportar PDF.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
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
                <MaterialIcons
                  name="file-download"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="privacyPolicy/index"
          options={{ title: "Política de Privacidade" }}
        />
        <Stack.Screen
          name="onboarding/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <Loading />
      <Toast />
    </View>
  );
}

export default function Layout() {
  return (
    <LoadingProvider>
      <ToastProvider>
        <LayoutContent />
      </ToastProvider>
    </LoadingProvider>
  );
}
