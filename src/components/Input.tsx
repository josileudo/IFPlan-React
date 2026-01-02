import React, { forwardRef } from "react";
import { theme } from "@/utils/theme";
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
    const isMasked = type === "currency" || type === "number";
    const realMask = createNumberMask({
      delimiter: ".",
      separator: ",",
      precision: precision,
    });

    // Convert raw value (e.g. "1234.56") to visual (e.g. "1.234,56")
    const getDisplayValue = (val: string | undefined): string => {
      if (!val) return "";
      const num = parseFloat(String(val));
      if (isNaN(num)) return val;

      // Format using pt-BR which uses dot for thousands and comma for decimals
      return num.toLocaleString("pt-BR", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
    };

    const handleChangeText = (masked: string, unmasked: string) => {
      // unmasked is usually just digits (e.g. "123456" for "1.234,56")
      // We need to convert this to "1234.56"
      if (!unmasked) {
        props.onChangeText?.("");
        return;
      }

      const rawValue = parseFloat(unmasked) / Math.pow(10, precision);
      props.onChangeText?.(rawValue.toFixed(precision));
    };

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        {isMasked ? (
          <MaskInput
            ref={ref as any}
            style={[styles.input, error && styles.inputError, style]}
            placeholderTextColor={theme.colors.text.placeholder}
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
            style={[styles.input, error && styles.inputError, style]}
            placeholderTextColor={theme.colors.text.placeholder}
            {...props}
          />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: "100%",
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12, // Keeping fixed vertical padding for touch target
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing.xs,
  },
});
