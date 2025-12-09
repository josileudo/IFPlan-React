import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function StartScreen() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      resizeMode="cover"
      imageStyle={{ opacity: 0.2 }}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LinearGradient
        colors={["#059668", "transparent"]}
        start={{ x: 0, y: -0.6 }}
        style={{ flex: 1, width: "100%", paddingHorizontal: 12 }}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>IFPlan</Text>
                <Text style={styles.subtitle}>Leite à Pasto</Text>
              </View>

              <Text style={styles.subtitle}>
                O IFPlan ajuda pequenos produtores de leite a realizarem
                simulações e análises sobre produtividade, custos e
                lucratividade baseados em dados reais da propriedade.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/dashboard")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Começar Agora</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Image
              source={require("../assets/lapis.png")}
              style={styles.logo}
              resizeMode="contain"
              borderRadius={8}
            />

            <Text style={styles.privacyPolicy}>Políticas e privacidade</Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    fontWeight: "600",
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
  footer: {
    justifyContent: "flex-end",
    width: "100%",
  },
  logo: {
    width: "auto",
    height: 40,
    marginBottom: 12,
  },
  privacyPolicy: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
});
