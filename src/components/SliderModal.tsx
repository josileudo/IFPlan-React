import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useState, useEffect, useMemo } from "react";
import { SimulationInput } from "../types";

interface SliderModalProps {
  visible: boolean;
  onClose: () => void;
  currentInputs: SimulationInput;
  onApply: (newInputs: SimulationInput) => void;
}

interface SliderItemProps {
  label: string;
  value: number;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function SliderItem({
  label,
  value,
  onValueChange,
  min = 1,
  max = 200,
  step = 1,
}: SliderItemProps) {
  const negativeAndPositiveValue = useMemo(() => {
    if (value <= 100) return (value / 100) * 100 - 100;
    return value - 100;
  }, [value]);

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text
          style={[
            styles.sliderValue,
            { color: negativeAndPositiveValue < 0 ? "#DC0000" : "#059669" },
          ]}
        >
          {negativeAndPositiveValue.toFixed(0)}%
        </Text>
      </View>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        maximumTrackTintColor="#059669"
        thumbTintColor="#059669"
      />
    </View>
  );
}

export function SliderModal({
  visible,
  onClose,
  currentInputs,
  onApply,
}: SliderModalProps) {
  const [vars, setVars] = useState({
    varCOE: 100,
    varDPL: 100,
    varFOR: 100,
    varMS: 100,
    varPreco: 100,
  });

  useEffect(() => {
    if (visible) {
      setVars({
        varCOE: (currentInputs.varCOE || 1) * 100,
        varDPL: (currentInputs.varDPL || 1) * 100,
        varFOR: (currentInputs.varFOR || 1) * 100,
        varMS: (currentInputs.varMS || 1) * 100,
        varPreco: (currentInputs.varPreco || 1) * 100,
      });
    }
  }, [visible, currentInputs]);

  const handleApply = () => {
    onApply({
      ...currentInputs,
      varCOE: vars.varCOE / 100,
      varDPL: vars.varDPL / 100,
      varFOR: vars.varFOR / 100,
      varMS: vars.varMS / 100,
      varPreco: vars.varPreco / 100,
    });
    onClose();
  };

  const handleChange = (key: keyof typeof vars, val: number) => {
    setVars((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Ajustes de Sensibilidade</Text>
          <Text style={styles.subtitle}>
            Varie as porcentagens para ver o impacto.
          </Text>

          <ScrollView>
            <SliderItem
              label="Var. COE"
              value={vars.varCOE}
              onValueChange={(v) => handleChange("varCOE", v)}
              max={200}
            />
            <SliderItem
              label="Var. DPL (Perda Prod.)"
              value={vars.varDPL}
              onValueChange={(v) => handleChange("varDPL", v)}
              max={200}
            />
            <SliderItem
              label="Var. Produção Forragem"
              value={vars.varFOR}
              onValueChange={(v) => handleChange("varFOR", v)}
              max={200}
            />
            <SliderItem
              label="Var. Consumo MS"
              value={vars.varMS}
              onValueChange={(v) => handleChange("varMS", v)}
              max={200}
            />
            <SliderItem
              label="Var. Preço Leite"
              value={vars.varPreco}
              onValueChange={(v) => handleChange("varPreco", v)}
              max={200}
            />
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
              <Text style={styles.applyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  applyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
