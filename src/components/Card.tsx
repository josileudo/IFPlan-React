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
  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.8}
        >
          <MaterialIcons name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>
      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}
      <Text style={styles.date}>{formattedDate}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: "#f5e7e2",
    padding: 4,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
