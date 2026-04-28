import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "../../store/useStore";
import { Input } from "../../components/Input";
import { SimulationInput } from "../../types";
import { simulationSchema, SimulationSchema } from "./schema";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme";
import { Button } from "@/components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "@/contexts/ToastContext";
import { STEP_FIELDS, STEPS } from "./utils";

export default function SimulationScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const { colors, typography, spacing, borderRadius } = useTheme();

  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);
  const isSavingRef = useRef(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const {
    addSimulation,
    updateSimulation,
    getSimulation,
    updateSimulationDetails,
  } = useStore();

  const sim = id ? getSimulation(id) : undefined;

  const defaultValues = sim
    ? {
        name: sim.name,
        description: sim.description,
        ...sim.inputs,
      }
    : {
        name: "",
        description: "",
      };

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isDirty },
  } = useForm<SimulationSchema>({
    resolver: zodResolver(simulationSchema),
    defaultValues: defaultValues as any,
    shouldFocusError: true,
    shouldUnregister: false,
  });

  useEffect(() => {
    if (id && !sim) {
      Alert.alert("Erro", "Simulação não encontrada");
      router.back();
    }
  }, [id, sim]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isSavingRef.current) {
        return;
      }
      if (!isDirty) {
        return;
      }
      e.preventDefault();
      setExitAction(e.data.action);
      setShowExitModal(true);
    });
    return unsubscribe;
  }, [navigation, isDirty, isEditing]);

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (exitAction) {
      navigation.dispatch(exitAction);
    } else {
      router.back();
    }
  };

  const onSubmit = (data: any) => {
    const { name, description, ...inputValues } = data;
    const inputs = {} as SimulationInput;
    Object.assign(inputs, inputValues);

    isSavingRef.current = true;
    setIsLoading(true);

    if (id) {
      updateSimulation(id, inputs);
      updateSimulationDetails(id, name, description || "");
      router.replace(`/result/${id}`);
      showToast("Simulação atualizada com sucesso", "success");
    } else {
      addSimulation(name, description || "", inputs);
      router.replace("/dashboard");
      showToast("Simulação criada com sucesso", "success");
    }
    setIsLoading(false);
  };

  const animateStepChange = (newStep: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(newStep);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const nextStep = async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await trigger(fields);

    if (isValid && currentStep < STEPS.length - 1) {
      animateStepChange(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      animateStepChange(currentStep - 1);
    } else {
      if (!isDirty && !isEditing) {
        router.back();
      } else {
        setExitAction(null);
        setShowExitModal(true);
      }
    }
  };

  const renderStepContent = () => {
    return (
      <>
        {/* Step 0: Identificação */}
        {currentStep === 0 && (
          <View>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome da Simulação"
                  placeholder="Ex: Fazenda Santa Clara"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Descrição (Opcional)"
                  placeholder="Cenário otimista..."
                  value={value || ""}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  style={{ height: 100, textAlignVertical: "top" }}
                  error={errors.description?.message}
                />
              )}
            />
          </View>
        )}

        {/*MARK: Step 1: Ambiente */}
        {currentStep === 1 && (
          <View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="temperaturaMinima"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Temp. Mínima (°C)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={1}
                    placeholder="Ex: 20"
                    style={styles.halfInput}
                    error={errors.temperaturaMinima?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="temperaturaMaxima"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Temp. Máxima (°C)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={1}
                    placeholder="Ex: 40"
                    style={styles.halfInput}
                    error={errors.temperaturaMaxima?.message}
                  />
                )}
              />
            </View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="precipitacao"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Precipitação (mm/dia)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={3}
                    style={styles.halfInput}
                    error={errors.precipitacao?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="umidadeRelativa"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Umidade Rel. (%)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={1}
                    style={styles.halfInput}
                    error={errors.umidadeRelativa?.message}
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name="velocidadeDoVento"
              render={({ field: { onChange, value } }) => (
                <Input
                  type="currency"
                  label="Velocidade do Vento (m/s)"
                  value={value ? String(value) : ""}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  precision={1}
                  style={[styles.halfInput]}
                  error={errors.velocidadeDoVento?.message}
                />
              )}
            />
          </View>
        )}

        {/*MARK: Step 2: Água e Solo */}
        {currentStep === 2 && (
          <View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="aguaDisponivelParaIrrigacao"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Água Disp. Irrig (m³/dia)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={0}
                    style={styles.halfInput}
                    error={errors.aguaDisponivelParaIrrigacao?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="aguaDeOutrosUsos"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Água Outros Usos (L/mês)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={0}
                    style={styles.halfInput}
                    error={errors.aguaDeOutrosUsos?.message}
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name="doseDeN"
              render={({ field: { onChange, value } }) => (
                <Input
                  type="currency"
                  label="Dose de N (kg N/ha/ano)"
                  value={value ? String(value) : ""}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  precision={0}
                  error={errors.doseDeN?.message}
                />
              )}
            />
          </View>
        )}

        {/* Step 3: Propriedade */}
        {currentStep === 3 && (
          <View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="area"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Área (ha)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={1}
                    style={styles.halfInput}
                    error={errors.area?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="numeroDePiquetes"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    precision={0}
                    label="Nº de Piquetes"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    style={styles.halfInput}
                    error={errors.numeroDePiquetes?.message}
                  />
                )}
              />
            </View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="deslocamentoHorizontal"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Desl. Horizontal (m)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={0}
                    style={styles.halfInput}
                    error={errors.deslocamentoHorizontal?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="deslocamentoVertical"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Desl. Vertical (m)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={0}
                    style={styles.halfInput}
                    error={errors.deslocamentoVertical?.message}
                  />
                )}
              />
            </View>
          </View>
        )}

        {/* Step 4: Rebanho */}
        {currentStep === 4 && (
          <View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="pesoCorporal"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Peso Corporal (kg)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={0}
                    style={styles.halfInput}
                    error={errors.pesoCorporal?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="producaoDeLeite"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Prod. Leite (L/vaca/dia)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={1}
                    style={styles.halfInput}
                    error={errors.producaoDeLeite?.message}
                  />
                )}
              />
            </View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="teorDeGorduraNoLeite"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Gordura (%)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={1}
                    style={styles.halfInput}
                    error={errors.teorDeGorduraNoLeite?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="teorDePBNoLeite"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Proteína Bruta (%)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    precision={1}
                    style={styles.halfInput}
                    error={errors.teorDePBNoLeite?.message}
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name="vacasEmLactacao"
              render={({ field: { onChange, value } }) => (
                <Input
                  type="currency"
                  label="Vacas em Lactação (%)"
                  value={value ? String(value) : ""}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  precision={1}
                  error={errors.vacasEmLactacao?.message}
                />
              )}
            />
          </View>
        )}

        {/* Step 5: Econômico */}
        {currentStep === 5 && (
          <View>
            <View style={styles.row}>
              <Controller
                control={control}
                name="investimentoPorL"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Investimento (R$/L)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    style={styles.halfInput}
                    error={errors.investimentoPorL?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="rendaFamiliar"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="currency"
                    label="Renda Familiar (R$/mês)"
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    style={styles.halfInput}
                    error={errors.rendaFamiliar?.message}
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name="taxaDeDepreciacao"
              render={({ field: { onChange, value } }) => (
                <Input
                  type="currency"
                  label="Taxa Depreciação (% a.a.)"
                  value={value ? String(value) : ""}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  precision={3}
                  error={errors.taxaDeDepreciacao?.message}
                />
              )}
            />
          </View>
        )}
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: Platform.OS === "android" ? insets.bottom : 0,
      }}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sleek Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarBackground,
              { backgroundColor: colors.border },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.stepSubtitle, { color: colors.text.secondary }]}>
          Passo {currentStep + 1} de {STEPS.length}
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text.primary,
              fontSize: 24,
              fontWeight: "800",
              marginBottom: 24,
            },
          ]}
        >
          {STEPS[currentStep].title}
        </Text>

        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.navigationButtons,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            padding: spacing.lg,
            paddingBottom: Math.max(insets.bottom, spacing.lg),
          },
        ]}
      >
        <Button
          title="Voltar"
          type="secondary"
          onPress={prevStep}
          style={styles.navButtons}
          icon="chevron-left"
        />

        {currentStep === STEPS.length - 1 ? (
          <Button
            title={isEditing ? "Salvar" : "Finalizar"}
            style={[styles.navButtons, { backgroundColor: colors.success }]}
            onPress={handleSubmit(onSubmit)}
            icon="check"
            iconSide="right"
            isProcessing={isLoading}
          />
        ) : (
          <Button
            title="Próximo"
            onPress={nextStep}
            style={styles.navButtons}
            icon="chevron-right"
            iconSide="right"
          />
        )}
      </View>

      {/* Exit Confirmation Bottom Sheet Modal */}
      <Modal visible={showExitModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderTopLeftRadius: borderRadius.xl,
                borderTopRightRadius: borderRadius.xl,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.error + "20" },
              ]}
            >
              <MaterialIcons name="warning" size={32} color={colors.error} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              Deseja realmente sair?
            </Text>
            <Text
              style={[
                styles.modalDescription,
                { color: colors.text.secondary },
              ]}
            >
              Se sair você perderá toda a sua simulação.
            </Text>
            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                type="secondary"
                onPress={() => setShowExitModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Sair"
                type="primary"
                onPress={handleConfirmExit}
                style={[styles.modalButton, { backgroundColor: colors.error }]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // padding set via component
  },
  progressBarContainer: {
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    paddingHorizontal: 8,
    lineHeight: 32,
  },
  formContainer: {
    flex: 1,
    minHeight: 300,
  },
  row: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    borderTopWidth: 1,
  },
  navButtons: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    padding: 24,
    alignItems: "center",
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  modalButton: {
    flex: 1,
  },
});
