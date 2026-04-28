import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStore } from "../../store/useStore";
import { useEffect, useState, useMemo, useCallback } from "react";
import { calculateSimulation } from "../../utils/formulas";
import { SimulationInput, SimulationOutput } from "../../types";
import { SliderModal } from "../../components/SliderModal";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ResultRow({
  label,
  value,
  unit,
  digits,
  itemStyle,
}: {
  label: string;
  value: number | null;
  unit?: string;
  digits?: number;
  itemStyle?: StyleProp<TextStyle>;
}) {
  const { colors, typography } = useTheme();
  const displayValue =
    value !== null
      ? value.toLocaleString("pt-BR", {
          minimumFractionDigits: digits ?? 2,
          maximumFractionDigits: digits ?? 2,
        })
      : "-";

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text.primary }, itemStyle]}>
        {displayValue}{" "}
        {unit && <Text style={[styles.unit, { color: colors.text.placeholder }, itemStyle]}>{unit}</Text>}
      </Text>
    </View>
  );
}

function Section({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  const { colors, spacing, borderRadius } = useTheme();
  return (
    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, padding: spacing.md, borderRadius: borderRadius.lg }]}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name={icon} size={22} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.primary, borderBottomColor: colors.border }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSimulation, updateSimulation } = useStore();
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useTheme();

  const originalSim = getSimulation(id!);
  const [currentInputs, setCurrentInputs] = useState<SimulationInput | null>(
    null,
  );
  const [sliderVisible, setSliderVisible] = useState(false);
  const [oldResults, setOldResults] = useState<SimulationOutput | null>(null);

  useEffect(() => {
    if (originalSim) {
      setCurrentInputs(originalSim.inputs);
      setOldResults(originalSim.results);
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
    return JSON.stringify(originalSim.inputs) !== JSON.stringify(currentInputs);
  }, [originalSim, currentInputs]);

  const applyColorByItemChanged = useCallback(
    (item: string) => {
      const hasResultChanged = oldResults?.[item] !== results?.[item];
      if (!hasResultChanged) return {};

      return oldResults?.[item] < results?.[item]
        ? { color: colors.success }
        : { color: colors.error };
    },
    [results, oldResults, colors],
  );

  const handleSave = () => {
    if (currentInputs && id) {
      updateSimulation(id, currentInputs);
      Alert.alert("Sucesso", "Alterações salvas.");
      router.back();
    }
  };

  const handleEdit = () => {
    router.replace(`/simulation?id=${id}`);
  };

  if (!results || !currentInputs) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text.primary, margin: spacing.lg }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { padding: spacing.md, gap: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* MARK: Resumo Produtivo */}
        <Section title="Resumo Produtivo" icon="bar-chart">
          <ResultRow
            label="Produção diária"
            value={results.producaoDiaria}
            unit="L/dia"
            digits={0}
            itemStyle={applyColorByItemChanged("producaoDiaria")}
          />
          <ResultRow
            label="Capacidade suporte"
            value={results.capacidadeDeSuporte}
            unit="animais"
            digits={1}
            itemStyle={applyColorByItemChanged("capacidadeDeSuporte")}
          />
          <ResultRow
            label="Produção forragem"
            value={results.producaoDeForragem}
            unit="kg MV/m2"
            digits={3}
            itemStyle={applyColorByItemChanged("producaoDeForragem")}
          />
          <ResultRow
            label="Produção de leite diária"
            value={results.producaoDeLeiteHaDia}
            unit="L/ha/dia"
            digits={1}
            itemStyle={applyColorByItemChanged("producaoDeLeiteHaDia")}
          />
          <ResultRow
            label="Produção de leite anual"
            value={results.producaoDeLeiteHaAno}
            unit="L/ha/ano"
            digits={0}
            itemStyle={applyColorByItemChanged("producaoDeLeiteHaAno")}
          />
          <ResultRow
            label="Taxa de lotação"
            value={results.taxaDeLotacao}
            unit="vacas/ha"
            digits={1}
            itemStyle={applyColorByItemChanged("taxaDeLotacao")}
          />
          <ResultRow
            label="DPL"
            value={results.dpl}
            unit="L/vaca/dia"
            digits={1}
            itemStyle={applyColorByItemChanged("dpl")}
          />
          <ResultRow
            label="Tensão da água no solo"
            value={results.tensaoDaAguaNoSolo}
            unit="bar"
            digits={3}
            itemStyle={applyColorByItemChanged("tensaoDaAguaNoSolo")}
          />
        </Section>

        {/* MARK: Indicadores Financeiros */}
        <Section title="Indicadores Financeiros" icon="monetization-on">
          <ResultRow
            label="Margem líquida"
            value={results.ml}
            unit="R$/L"
            digits={3}
            itemStyle={applyColorByItemChanged("ml")}
          />
          <ResultRow
            label="Rentabilidade (TRCI)"
            value={results.trci}
            unit="%"
            itemStyle={applyColorByItemChanged("trci")}
          />
          <ResultRow
            label="Payback"
            value={results.payback}
            unit="anos"
            digits={1}
            itemStyle={applyColorByItemChanged("payback")}
          />
          <ResultRow
            label="Preço do Leite"
            value={results.precoDoLeite}
            unit="R$/L"
            digits={3}
            itemStyle={applyColorByItemChanged("precoDoLeite")}
          />
          <ResultRow
            label="COE por litro"
            value={results.coe}
            unit="R$/L"
            digits={3}
            itemStyle={applyColorByItemChanged("coe")}
          />
          <ResultRow
            label="COT por litro"
            value={results.cot}
            unit="R$/L"
            digits={3}
            itemStyle={applyColorByItemChanged("cot")}
          />
          <ResultRow
            label="Receita por área"
            value={results.receitaPorArea}
            unit="R$/ha/ano"
            digits={2}
            itemStyle={applyColorByItemChanged("receitaPorArea")}
          />
        </Section>

        {/* MARK: Ambiente e Estresse */}
        <Section title="Ambiente e Estresse" icon="eco">
          <ResultRow label="ITU" value={results.itu} digits={1} />
          <ResultRow
            label="Perda Receita (Estresse)"
            value={results.perdaDeReceitaComEstresse}
            unit="R$/ano"
            itemStyle={applyColorByItemChanged("perdaDeReceitaComEstresse")}
          />
          <ResultRow
            label="Pegada Hídrica"
            value={results.pegadaHidrica}
            unit="L H2O/L leite"
            digits={1}
            itemStyle={applyColorByItemChanged("pegadaHidrica")}
          />
          <ResultRow
            label="Perda de produção"
            value={results.producaoDeLeiteHaDia}
            unit="L/vaca/dia"
            digits={1}
            itemStyle={applyColorByItemChanged("producaoDeLeiteHaDia")}
          />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: colors.surface, borderTopColor: colors.border }]}
      >
        {hasChanges ? (
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Text style={[styles.footerButtonText, { color: colors.surface }]}>Salvar Alterações</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleEdit}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text.primary }]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => setSliderVisible(true)}
            >
              <Text style={[styles.footerButtonText, { color: colors.surface }]}>Sensibilidade</Text>
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
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  unit: {
    fontSize: 12,
    fontWeight: "400",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 16,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  footerButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
