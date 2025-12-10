import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStore } from "../../store/useStore";
import { useEffect, useState, useMemo } from "react";
import { calculateSimulation } from "../../utils/formulas";
import { SimulationInput } from "../../types";
import { SliderModal } from "../../components/SliderModal";

function ResultRow({
  label,
  value,
  unit,
  digits,
}: {
  label: string;
  value: number | null;
  unit?: string;
  digits?: number;
}) {
  const displayValue =
    value !== null
      ? value.toLocaleString("pt-BR", {
          minimumFractionDigits: digits || 2,
          maximumFractionDigits: digits || 2,
        })
      : "-";

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {displayValue} {unit && <Text style={styles.unit}>{unit}</Text>}
      </Text>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSimulation, updateSimulation } = useStore();

  const originalSim = getSimulation(id!);
  const [currentInputs, setCurrentInputs] = useState<SimulationInput | null>(
    null
  );
  const [sliderVisible, setSliderVisible] = useState(false);

  useEffect(() => {
    if (originalSim) {
      setCurrentInputs(originalSim.inputs);
    } else {
      // Handle loading or error
    }
  }, [originalSim]);

  const results = useMemo(() => {
    if (!currentInputs) return null;
    return calculateSimulation(currentInputs);
  }, [currentInputs]);

  // Check if inputs (vars) differ from original
  const hasChanges = useMemo(() => {
    if (!originalSim || !currentInputs) return false;
    // Simple JSON stringify comparison or specific fields check
    return JSON.stringify(originalSim.inputs) !== JSON.stringify(currentInputs);
  }, [originalSim, currentInputs]);

  const handleSave = () => {
    if (currentInputs && id) {
      updateSimulation(id, currentInputs);
      Alert.alert("Sucesso", "Alterações salvas.");
      router.back(); // Or stay? Prompt says "ao salvar volta para a tela de dashboard".
    }
  };

  const handleEdit = () => {
    router.push(`/simulation?id=${id}`);
  };

  if (!results || !currentInputs) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Resumo Produtivo">
          <ResultRow
            label="Produção Diária"
            value={results.producaoDiaria}
            unit="L/dia"
          />
          <ResultRow
            label="Produção Anual"
            value={results.producaoDeLeiteHaAno}
            unit="L/ha/ano"
          />
          <ResultRow
            label="Capacidade Suporte"
            value={results.capacidadeDeSuporte}
            unit="animais"
          />
          <ResultRow
            label="Consumo Total"
            value={results.consumoTotal}
            unit="kg MS/dia"
          />
        </Section>

        <Section title="Indicadores Financeiros">
          <ResultRow
            label="Margem Líquida"
            value={results.ml}
            unit="R$/L"
            digits={3}
          />
          <ResultRow
            label="Lucro Anual (ML Anual)"
            value={results.mlAnual}
            unit="R$"
          />
          <ResultRow
            label="Rentabilidade (TRCI)"
            value={results.trci}
            unit="%"
          />
          <ResultRow
            label="Payback"
            value={results.payback}
            unit="anos"
            digits={1}
          />
          <ResultRow
            label="Investimento Total"
            value={results.investimentoTotal}
            unit="R$"
          />
          <ResultRow label="COE Total" value={results.coeTotal} unit="R$/ano" />
        </Section>

        <Section title="Ambiente e Estresse">
          <ResultRow label="ITU" value={results.itu} digits={1} />
          <ResultRow
            label="Perda Receita (Estresse)"
            value={results.perdaDeReceitaComEstresse}
            unit="R$/ano"
          />
          <ResultRow
            label="Pegada Hídrica"
            value={results.pegadaHidrica}
            unit="L H2O/L leite"
          />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        {hasChanges ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.footerButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleEdit}
            >
              <Text style={styles.secondaryButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setSliderVisible(true)}
            >
              <Text style={styles.footerButtonText}>Sensibilidade</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <SliderModal
        visible={sliderVisible}
        onClose={() => setSliderVisible(false)}
        currentInputs={currentInputs}
        onApply={setCurrentInputs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  unit: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "400",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    gap: 16,
    paddingBottom: 32,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#059669",
    paddingVertical: 14, // Reduced padding
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 16,
  },
});
