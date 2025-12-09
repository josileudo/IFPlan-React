import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { Input } from "../../components/Input";
import { InitialInputs, SimulationInput } from "../../types";

export default function SimulationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

  const {
    addSimulation,
    updateSimulation,
    getSimulation,
    updateSimulationDetails,
  } = useStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inputs, setInputs] = useState<SimulationInput>(InitialInputs);

  useEffect(() => {
    if (id) {
      const sim = getSimulation(id);
      if (sim) {
        setName(sim.name || "");
        setDescription(sim.description || "");
        setInputs(sim.inputs);
        // Ensure navigation title reflects "Editar"
      } else {
        Alert.alert("Erro", "Simulação não encontrada");
        router.back();
      }
    }
  }, [id]);

  const handleInputChange = (key: keyof SimulationInput, value: string) => {
    if (value === "") {
      setInputs((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    // Replace comma with dot for decimals (legacy check, mostly unused now)
    const validValue = Number(value.replace(",", ".")).toFixed(2);
    setInputs((prev) => ({ ...prev, [key]: validValue }));
  };

  // Helper to get string value for input
  const getStr = (key: keyof SimulationInput) => {
    return inputs[key] !== undefined ? String(inputs[key]) : "";
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Por favor, dê um nome para a simulação.");
      return;
    }

    if (isEditing && id) {
      updateSimulation(id, inputs);
      updateSimulationDetails(id, name, description);
      // Navigate back to result or dashboard?
      // Flow 1 says: "editar Simulação... podendo editar e assim refazer os cálculos novamente".
      // Presumably goes to Result showing new calculations.
      router.replace(`/result/${id}`);
    } else {
      addSimulation(name, description, inputs);
      router.replace("/dashboard");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Identificação</Text>
        <Input
          label="Nome da Simulação"
          placeholder="Ex: Fazenda Santa Clara"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Descrição (Opcional)"
          placeholder="Cenário otimista..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: "top" }}
        />

        <Text style={styles.sectionTitle}>Ambiente</Text>
        <View style={styles.row}>
          <Input
            type="currency"
            label="Temp. Mínima (°C)"
            value={getStr("temperaturaMinima")}
            onChangeText={(t) => {
              console.log(t);
              handleInputChange("temperaturaMinima", t);
            }}
            keyboardType="numeric"
            precision={1}
            style={styles.halfInput}
          />
          <Input
            type="currency"
            label="Temp. Máxima (°C)"
            value={getStr("temperaturaMaxima")}
            onChangeText={(t) => handleInputChange("temperaturaMaxima", t)}
            keyboardType="numeric"
            precision={1}
            style={styles.halfInput}
          />
        </View>
        <View style={styles.row}>
          <Input
            type="currency"
            label="Precipitação (mm/dia)"
            value={getStr("precipitacao")}
            onChangeText={(t) => handleInputChange("precipitacao", t)}
            keyboardType="numeric"
            precision={3}
            style={styles.halfInput}
          />
          <Input
            type="currency"
            label="Umidade Rel. (%)"
            value={getStr("umidadeRelativa")}
            onChangeText={(t) => handleInputChange("umidadeRelativa", t)}
            keyboardType="numeric"
            precision={1}
            style={styles.halfInput}
          />
        </View>
        <Input
          type="currency"
          label="Velocidade do Vento (m/s)"
          value={getStr("velocidadeDoVento")}
          onChangeText={(t) => handleInputChange("velocidadeDoVento", t)}
          keyboardType="numeric"
          precision={1}
        />

        <Text style={styles.sectionTitle}>Água e Solo</Text>
        <View style={styles.row}>
          <Input
            type="currency"
            label="Água Disp. Irrigação (m³/dia)"
            value={getStr("aguaDisponivelParaIrrigacao")}
            onChangeText={(t) =>
              handleInputChange("aguaDisponivelParaIrrigacao", t)
            }
            keyboardType="numeric"
            precision={0}
            style={styles.halfInput}
          />
          <Input
            type="currency"
            label="Água Outros Usos (L/mês)"
            value={getStr("aguaDeOutrosUsos")}
            onChangeText={(t) => handleInputChange("aguaDeOutrosUsos", t)}
            keyboardType="numeric"
            precision={0}
            style={styles.halfInput}
          />
        </View>
        <Input
          type="currency"
          label="Dose de N (kg N/ha/ano)"
          value={getStr("doseDeN")}
          onChangeText={(t) => handleInputChange("doseDeN", t)}
          keyboardType="numeric"
          precision={0}
        />

        <Text style={styles.sectionTitle}>Propriedade</Text>
        <View style={styles.row}>
          <Input
            type="currency"
            label="Área (ha)"
            value={getStr("area")}
            onChangeText={(t) => handleInputChange("area", t)}
            keyboardType="numeric"
            precision={1}
            style={styles.halfInput}
          />
          <Input
            type="currency"
            precision={0}
            label="Nº de Piquetes"
            value={getStr("numeroDePiquetes")}
            onChangeText={(t) => handleInputChange("numeroDePiquetes", t)}
            keyboardType="numeric"
            style={styles.halfInput}
          />
        </View>
        <View style={styles.row}>
          <Input
            type="currency"
            label="Desl. Horizontal (m)"
            value={getStr("deslocamentoHorizontal")}
            onChangeText={(t) => handleInputChange("deslocamentoHorizontal", t)}
            keyboardType="numeric"
            precision={0}
            style={styles.halfInput}
          />
          <Input
            type="currency"
            label="Desl. Vertical (m)"
            value={getStr("deslocamentoVertical")}
            onChangeText={(t) => handleInputChange("deslocamentoVertical", t)}
            keyboardType="numeric"
            precision={0}
            style={styles.halfInput}
          />
        </View>

        <Text style={styles.sectionTitle}>Rebanho</Text>
        <View style={styles.row}>
          <Input
            type="currency"
            label="Peso Corporal (kg)"
            value={getStr("pesoCorporal")}
            onChangeText={(t) => handleInputChange("pesoCorporal", t)}
            keyboardType="numeric"
            precision={0}
            style={styles.halfInput}
          />
          <Input
            type="currency"
            label="Prod. Leite (L/vaca/dia)"
            value={getStr("producaoDeLeite")}
            onChangeText={(t) => handleInputChange("producaoDeLeite", t)}
            keyboardType="numeric"
            precision={1}
            style={styles.halfInput}
          />
        </View>
        <View style={styles.row}>
          <Input
            type="currency"
            label="Gordura (%)"
            value={getStr("teorDeGorduraNoLeite")}
            onChangeText={(t) => handleInputChange("teorDeGorduraNoLeite", t)}
            keyboardType="numeric"
            precision={1}
            style={styles.halfInput}
          />
          <Input
            type="currency"
            label="Proteína Bruta (%)"
            value={getStr("teorDePBNoLeite")}
            onChangeText={(t) => handleInputChange("teorDePBNoLeite", t)}
            keyboardType="numeric"
            precision={1}
            style={styles.halfInput}
          />
        </View>
        <Input
          type="currency"
          label="Vacas em Lactação (%)"
          value={getStr("vacasEmLactacao")}
          onChangeText={(t) => handleInputChange("vacasEmLactacao", t)}
          keyboardType="numeric"
          precision={1}
        />

        <Text style={styles.sectionTitle}>Econômico</Text>
        <View style={styles.row}>
          <Input
            type="currency"
            label="Investimento (R$/L)"
            value={getStr("investimentoPorL")}
            onChangeText={(t) => handleInputChange("investimentoPorL", t)}
            keyboardType="numeric"
            style={styles.halfInput}
          />
          <Input
            type="currency"
            label="Renda Familiar (R$/mês)"
            value={getStr("rendaFamiliar")}
            onChangeText={(t) => handleInputChange("rendaFamiliar", t)}
            keyboardType="numeric"
            style={styles.halfInput}
          />
        </View>
        <Input
          type="currency"
          label="Taxa Depreciação (% a.a.)"
          value={getStr("taxaDeDepreciacao")}
          onChangeText={(t) => handleInputChange("taxaDeDepreciacao", t)}
          keyboardType="numeric"
          precision={3}
        />

        <View style={{ height: 20 }} />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
