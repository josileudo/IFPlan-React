import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "../../store/useStore";
import { Input } from "../../components/Input";
import { SimulationInput } from "../../types";
import { simulationSchema, SimulationSchema } from "./schema";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/utils/theme";
import { Button } from "@/components/Button";

const STEPS = [
  { title: "Identificação", key: "identification" },
  { title: "Ambiente", key: "environment" },
  { title: "Água e Solo", key: "water_soil" },
  { title: "Propriedade", key: "property" },
  { title: "Rebanho", key: "herd" },
  { title: "Econômico", key: "economic" },
];

export default function SimulationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;
  const [currentStep, setCurrentStep] = useState(0);

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
    formState: { errors },
  } = useForm<SimulationSchema>({
    resolver: zodResolver(simulationSchema),
    defaultValues: defaultValues as any,
    shouldUnregister: false,
  });

  useEffect(() => {
    if (id && !sim) {
      Alert.alert("Erro", "Simulação não encontrada");
      router.back();
    }
  }, [id, sim]);

  const onSubmit = (data: any) => {
    const { name, description, ...inputValues } = data;
    const inputs = {} as SimulationInput;
    Object.assign(inputs, inputValues);

    if (id) {
      updateSimulation(id, inputs);
      updateSimulationDetails(id, name, description || "");
      router.replace(`/result/${id}`);
    } else {
      addSimulation(name, description || "", inputs);
      router.replace("/dashboard");
    }
  };

  const nextStep = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    return (
      <>
        {/* Step 0: Identificação */}
        <View style={{ display: currentStep === 0 ? "flex" : "none" }}>
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
                style={{ height: 80, textAlignVertical: "top" }}
                error={errors.description?.message}
              />
            )}
          />
        </View>

        {/*MARK: Step 1: Ambiente */}
        <View style={{ display: currentStep === 1 ? "flex" : "none" }}>
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
                  precision={1}
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

        {/*MARK: Step 2: Água e Solo */}
        <View style={{ display: currentStep === 2 ? "flex" : "none" }}>
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

        {/* Step 3: Propriedade */}
        <View style={{ display: currentStep === 3 ? "flex" : "none" }}>
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

        {/* Step 4: Rebanho */}
        <View style={{ display: currentStep === 4 ? "flex" : "none" }}>
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

        {/* Step 5: Econômico */}
        <View style={{ display: currentStep === 5 ? "flex" : "none" }}>
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
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stepper Progress */}
        <View style={styles.stepperContainer}>
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <View key={step.key} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isActive && styles.activeStepCircle,
                    isCompleted && styles.completedStepCircle,
                  ]}
                >
                  {isCompleted ? (
                    <MaterialIcons
                      name="check"
                      size={12}
                      color={theme.colors.surface}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        isActive && styles.activeStepNumber,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                {/* Optional: Label below step */}
                {/* <Text style={[styles.stepLabel, isActive && styles.activeStepLabel]}>
                  {step.title}
                </Text> */}
                {index < STEPS.length - 1 && <View style={styles.stepLine} />}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>{STEPS[currentStep].title}</Text>

        <View style={styles.formContainer}>{renderStepContent()}</View>

        <View style={styles.navigationButtons}>
          <Button
            title="Voltar"
            type="secondary"
            onPress={prevStep}
            style={styles.navButtons}
            disabled={currentStep === 0}
            icon="chevron-left"
          />

          {currentStep === STEPS.length - 1 ? (
            <Button
              title={isEditing ? "Salvar" : "Finalizar"}
              style={[styles.navButtons, styles.saveButton]}
              onPress={handleSubmit(onSubmit)}
              icon="check"
              iconSide="right"
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

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  activeStepCircle: {
    backgroundColor: theme.colors.primary,
  },
  completedStepCircle: {
    backgroundColor: theme.colors.success,
  },
  stepNumber: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: "600",
  },
  activeStepNumber: {
    color: theme.colors.surface,
  },
  stepLine: {
    width: 16,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: 2,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
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
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xl,
    gap: 8,
  },
  saveButton: {
    backgroundColor: theme.colors.success,
  },
  navButtons: {
    width: "48%",
  },
});
