import { theme } from "@/utils/theme";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useRouter, Redirect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function StartScreen() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const { hasSeenOnboarding } = useStore();

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)", "#000000"]}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.headlineText}>Mais Lucro,</Text>
              <Text style={styles.headlineText}>Visão Real e</Text>
              <Text style={[styles.headlineText, styles.highlightText]}>
                Zero Perdas
              </Text>

              <Text style={styles.description}>
                O IFPlan ajuda pequenos produtores a realizarem simulações e
                análises sobre lucratividade baseados em dados reais da
                propriedade.
              </Text>
            </View>

            <Button
              title="Iniciar"
              onPress={() => router.replace("/dashboard")}
              style={styles.button}
              icon="arrow-forward"
              iconSide="right"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  textContainer: {
    marginBottom: 40,
  },
  headlineText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 52,
    letterSpacing: -1,
  },
  highlightText: {
    color: theme.colors.primary,
  },
  description: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 20,
    lineHeight: 24,
    fontWeight: "400",
  },
  button: {
    height: 56,
    borderRadius: 30,
    marginBottom: 30,
  },
});
