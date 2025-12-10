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
import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "../../store/useStore";
import { Input } from "../../components/Input";
import { SimulationInput } from "../../types";
import { simulationSchema, SimulationSchema } from "./schema";

export default function SimulationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

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
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<SimulationSchema>({
    resolver: zodResolver(simulationSchema),
    defaultValues: defaultValues as any,
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 120}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Identificação</Text>
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

        <Text style={styles.sectionTitle}>Ambiente</Text>
        <View style={styles.row}>
          <Controller
            control={control}
            name="temperaturaMinima"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[0] = el)}
                type="currency"
                label="Temp. Mínima (°C)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={1}
                placeholder="Ex: 20"
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[1]?.focus()}
                error={errors.temperaturaMinima?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="temperaturaMaxima"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[1] = el)}
                type="currency"
                label="Temp. Máxima (°C)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={1}
                placeholder="Ex: 40"
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[2]?.focus()}
                error={errors.temperaturaMaxima?.message}
              />
            )}
          />
        </View>
        <View
          style={[styles.row, Object.values(errors).length > 0 && { gap: 16 }]}
        >
          <Controller
            control={control}
            name="precipitacao"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[2] = el)}
                type="currency"
                label="Precipitação (mm/dia)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={1}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[3]?.focus()}
                error={errors.precipitacao?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="umidadeRelativa"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[3] = el)}
                type="currency"
                label="Umidade Rel. (%)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={1}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[4]?.focus()}
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
              ref={(el) => (inputRefs.current[4] = el)}
              type="currency"
              label="Velocidade do Vento (m/s)"
              value={value ? String(value) : ""}
              onChangeText={onChange}
              keyboardType="numeric"
              precision={1}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => inputRefs.current[5]?.focus()}
              style={[styles.halfInput]}
              error={errors.velocidadeDoVento?.message}
            />
          )}
        />

        <Text style={styles.sectionTitle}>Água e Solo</Text>
        <View style={styles.row}>
          <Controller
            control={control}
            name="aguaDisponivelParaIrrigacao"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[5] = el)}
                type="currency"
                label="Água Disp. Irrig (m³/dia)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={0}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[6]?.focus()}
                error={errors.aguaDisponivelParaIrrigacao?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="aguaDeOutrosUsos"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[6] = el)}
                type="currency"
                label="Água Outros Usos (L/mês)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={0}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[7]?.focus()}
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
              ref={(el) => (inputRefs.current[7] = el)}
              type="currency"
              label="Dose de N (kg N/ha/ano)"
              value={value ? String(value) : ""}
              onChangeText={onChange}
              keyboardType="numeric"
              precision={0}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => inputRefs.current[8]?.focus()}
              error={errors.doseDeN?.message}
            />
          )}
        />

        <Text style={styles.sectionTitle}>Propriedade</Text>
        <View style={styles.row}>
          <Controller
            control={control}
            name="area"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[8] = el)}
                type="currency"
                label="Área (ha)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={1}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[9]?.focus()}
                error={errors.area?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="numeroDePiquetes"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[9] = el)}
                type="currency"
                precision={0}
                label="Nº de Piquetes"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[10]?.focus()}
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
                ref={(el) => (inputRefs.current[10] = el)}
                type="currency"
                label="Desl. Horizontal (m)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={0}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[11]?.focus()}
                error={errors.deslocamentoHorizontal?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="deslocamentoVertical"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[11] = el)}
                type="currency"
                label="Desl. Vertical (m)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={0}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[12]?.focus()}
                error={errors.deslocamentoVertical?.message}
              />
            )}
          />
        </View>

        <Text style={styles.sectionTitle}>Rebanho</Text>
        <View style={styles.row}>
          <Controller
            control={control}
            name="pesoCorporal"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[12] = el)}
                type="currency"
                label="Peso Corporal (kg)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={0}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[13]?.focus()}
                error={errors.pesoCorporal?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="producaoDeLeite"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[13] = el)}
                type="currency"
                label="Prod. Leite (L/vaca/dia)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={1}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[14]?.focus()}
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
                ref={(el) => (inputRefs.current[14] = el)}
                type="currency"
                label="Gordura (%)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={1}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[15]?.focus()}
                error={errors.teorDeGorduraNoLeite?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="teorDePBNoLeite"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[15] = el)}
                type="currency"
                label="Proteína Bruta (%)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                precision={1}
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[16]?.focus()}
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
              ref={(el) => (inputRefs.current[16] = el)}
              type="currency"
              label="Vacas em Lactação (%)"
              value={value ? String(value) : ""}
              onChangeText={onChange}
              keyboardType="numeric"
              precision={1}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => inputRefs.current[17]?.focus()}
              error={errors.vacasEmLactacao?.message}
            />
          )}
        />

        <Text style={styles.sectionTitle}>Econômico</Text>
        <View style={styles.row}>
          <Controller
            control={control}
            name="investimentoPorL"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[17] = el)}
                type="currency"
                label="Investimento (R$/L)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[18]?.focus()}
                error={errors.investimentoPorL?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="rendaFamiliar"
            render={({ field: { onChange, value } }) => (
              <Input
                ref={(el) => (inputRefs.current[18] = el)}
                type="currency"
                label="Renda Familiar (R$/mês)"
                value={value ? String(value) : ""}
                onChangeText={onChange}
                keyboardType="numeric"
                style={styles.halfInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => inputRefs.current[19]?.focus()}
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
              ref={(el) => (inputRefs.current[19] = el)}
              type="currency"
              label="Taxa Depreciação (% a.a.)"
              value={value ? String(value) : ""}
              onChangeText={onChange}
              keyboardType="numeric"
              precision={3}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss} // Last one closes keyboard
              error={errors.taxaDeDepreciacao?.message}
            />
          )}
        />

        <View style={{ height: 20 }} />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSubmit(onSubmit)?.()}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? "Recalcular e Salvar" : "Criar Simulação"}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#059669",
    marginTop: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  row: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  halfInput: {
    flex: 1,
    // Width is handled by flex
  },
  saveButton: {
    backgroundColor: "#059669",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
