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
import { useTheme } from "@/utils/theme";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

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
  const { colors } = useTheme();

  const negativeAndPositiveValue = useMemo(() => {
    if (value <= 100) return (value / 100) * 100 - 100;
    return value - 100;
  }, [value]);

  const handleDecrease = () => {
    if (value > min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange(value - step);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange(value + step);
    }
  };

  const handleSliderChange = (val: number) => {
    onValueChange(val);
  };

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.labelRow}>
        <Text style={[styles.sliderLabel, { color: colors.text.primary }]}>
          {label}
        </Text>
        <Text
          style={[
            styles.sliderValue,
            {
              color:
                negativeAndPositiveValue < 0 ? colors.error : colors.success,
            },
          ]}
        >
          {negativeAndPositiveValue.toFixed(0)}%
        </Text>
      </View>

      <View style={styles.sliderControlRow}>
        <TouchableOpacity
          onPress={handleDecrease}
          style={[styles.iconButton, { backgroundColor: colors.background }]}
        >
          <MaterialIcons
            name="remove"
            size={24}
            color={colors.text.secondary}
          />
        </TouchableOpacity>

        <Slider
          style={{ flex: 1, height: 40, marginHorizontal: 8 }}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={handleSliderChange}
          onSlidingComplete={() => Haptics.selectionAsync()}
          maximumTrackTintColor={colors.border}
          minimumTrackTintColor={colors.primary}
          thumbTintColor={colors.primary}
        />

        <TouchableOpacity
          onPress={handleIncrease}
          style={[styles.iconButton, { backgroundColor: colors.background }]}
        >
          <MaterialIcons name="add" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function SliderModal({
  visible,
  onClose,
  currentInputs,
  onApply,
}: SliderModalProps) {
  const { colors, borderRadius } = useTheme();
  const [vars, setVars] = useState({
    varCOE: 100,
    varDPL: 100,
    varFOR: 100,
    varMS: 100,
    varPreco: 100,
  });

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        <View
          style={[
            styles.content,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Ajustes de Sensibilidade
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Varie as porcentagens para ver o impacto.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
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
              <Text
                style={[styles.cancelText, { color: colors.text.secondary }]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.applyText, { color: colors.surface }]}>
                Aplicar
              </Text>
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
    padding: 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
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
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  sliderControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  applyText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
