import { useStore } from "@/store/useStore";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function Layout() {
  const { clearSimulations } = useStore();

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
            headerLargeTitle: true,
            headerRight: () => (
              <TouchableOpacity onPress={handleClearSimulations}>
                <Text style={{ color: "red", fontWeight: "bold" }}>
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
          }}
        />
      </Stack>
    </View>
  );
}
