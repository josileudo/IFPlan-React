import React, { forwardRef } from "react";
import { useTheme } from "@/utils/theme";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import MaskInput, { createNumberMask } from "react-native-mask-input";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  precision?: number;
  type?: "number" | "currency" | "text";
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, style, type = "text", precision = 2, ...props }, ref) => {
    const { colors, typography, spacing, borderRadius } = useTheme();

    const isMasked = type === "currency" || type === "number";
    const realMask = createNumberMask({
      delimiter: ".",
      separator: ",",
      precision: precision,
    });

    const getDisplayValue = (val: string | undefined): string => {
      if (!val) return "";
      const num = parseFloat(String(val));
      if (isNaN(num)) return val;

      return num.toLocaleString("pt-BR", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
    };

    const handleChangeText = (masked: string, unmasked: string) => {
      if (!unmasked) {
        props.onChangeText?.("");
        return;
      }

      const rawValue = parseFloat(unmasked) / Math.pow(10, precision);
      props.onChangeText?.(rawValue.toFixed(precision));
    };

    const dynamicStyles = {
      label: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.semibold as any,
        color: colors.text.primary,
        marginBottom: spacing.xs,
      },
      input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: error ? colors.error : colors.border,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        fontSize: typography.sizes.md,
        color: colors.text.primary,
      },
      errorText: {
        color: colors.error,
        fontSize: typography.sizes.xs,
        marginTop: spacing.xs,
      },
    };

    return (
      <View style={[styles.container, { marginBottom: spacing.md }]}>
        <Text style={dynamicStyles.label}>{label}</Text>

        {isMasked ? (
          <MaskInput
            ref={ref as any}
            style={[dynamicStyles.input, style]}
            placeholderTextColor={colors.text.placeholder}
            placeholder="0.00"
            mask={realMask}
            {...props}
            value={getDisplayValue(props.value)}
            onChangeText={handleChangeText}
            keyboardType="numeric"
          />
        ) : (
          <TextInput
            ref={ref}
            style={[dynamicStyles.input, style]}
            placeholderTextColor={colors.text.placeholder}
            {...props}
          />
        )}
        {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
