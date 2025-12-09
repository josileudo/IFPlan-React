import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function Layout() {
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
