import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function StartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>IFPlan</Text>
          <Text style={styles.subtitle}>
            Simulador de Planejamento{"\n"}Agropecuário
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
          {/* Placeholder for illustration */}
          <View style={styles.circle} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/dashboard")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Começar Agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#059669",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 32,
    paddingTop: 100,
    paddingBottom: 60,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: "#e0f2fe",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 26,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#059669",
    fontSize: 18,
    fontWeight: "700",
  },
});
