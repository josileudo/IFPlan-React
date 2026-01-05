import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { useStore } from "../../store/useStore";
import { theme } from "@/utils/theme";
import { Button } from "@/components/Button";

const { width } = Dimensions.get("window");

const STEPS = [
  {
    key: "productivity",
    welcomeTitle: "Seja muito bem-vindo ao \nIFPlan Leite à pasto",
    title: "Produtividade",
    description:
      "Aumente a produtividade do seu rebanho com planejamento estratégico e dados precisos.",
    lottie: require("../../assets/lottie/productivity.json"),
  },
  {
    key: "math",
    title: "Precisão",
    description:
      "Utilize cálculos avançados para otimizar recursos e garantir os melhores resultados.",
    lottie: require("../../assets/lottie/math.json"),
  },
  {
    key: "animal",
    title: "Bem-estar Animal",
    description:
      "Monitore e melhore as condições do seu rebanho para uma produção sustentável.",
    lottie: require("../../assets/lottie/animal.json"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const lottieRef = useRef<LottieView>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      lottieRef.current?.play();
    } else {
      completeOnboarding();
      router.replace("/dashboard");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      lottieRef.current?.play();
    }
  };

  const step = STEPS[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>{"Seja muito bem-vindo!"}</Text>
        <View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            source={step.lottie}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>

        <View style={styles.dotsContainer}>
          {STEPS.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentStep && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <Button
              title="Anterior"
              type="secondary"
              onPress={handlePrev}
              style={styles.button}
            />
          )}
          <Button
            title={currentStep === STEPS.length - 1 ? "Começar" : "Próximo"}
            onPress={handleNext}
            style={[styles.button, currentStep === 0 && styles.fullWidthButton]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: theme.typography.sizes["3xl"],
    fontWeight: "bold",
    marginBottom: theme.spacing.xl,
    textAlign: "center",
    color: theme.colors.primary,
    lineHeight: 38,
  },
  lottieContainer: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: theme.spacing.xl,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  description: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  footer: {
    padding: theme.spacing.xl,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  button: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
});
