import { useTheme } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CardProps {
  title: string;
  description?: string;
  date: string;
  onPress: () => void;
  onDelete: () => void;
}

export function Card({
  title,
  description,
  date,
  onPress,
  onDelete,
}: CardProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.surface, 
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginBottom: spacing.md,
        }
      ]} 
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary, fontSize: typography.sizes.lg, fontWeight: "700" }]} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onDelete}
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
      
      {description && (
        <Text style={[styles.description, { color: colors.text.secondary, fontSize: typography.sizes.sm, marginBottom: spacing.sm }]} numberOfLines={2}>
          {description}
        </Text>
      )}
      
      <Text style={[styles.date, { color: colors.text.placeholder, fontSize: typography.sizes.xs }]}>
        {formattedDate}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    lineHeight: 20,
  },
  date: {
    fontWeight: "500",
    marginTop: 4,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
