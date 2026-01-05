import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

/* ================= CSV ================= */

export function toCsv(
  rows: Record<string, any>[],
  columns?: { key: string; label: string }[]
): string {
  if (!rows || rows.length === 0) return "";

  const keys = columns ? columns.map((c) => c.key) : Object.keys(rows[0]);
  const headers = columns ? columns.map((c) => c.label) : keys;

  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    const needsQuotes = /[",\n]/.test(s);
    const escaped = s.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) => keys.map((k) => escape(row[k])).join(",")),
  ];

  return lines.join("\r\n");
}

/* ================= EXPORT CSV ================= */

export async function exportCsvAndShare(
  rows: Record<string, any>[],
  filename = "export.csv",
  columns?: { key: string; label: string }[]
): Promise<string> {
  const csv = toCsv(rows, columns);
  if (!csv) throw new Error("CSV vazio");

  const bom = "\uFEFF"; // Excel UTF-8
  const content = bom + csv;

  const tempUri = `${FileSystem.documentDirectory}${filename}`;

  // 1️⃣ SEMPRE cria o arquivo primeiro
  await FileSystem.writeAsStringAsync(tempUri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  // 2️⃣ ANDROID APK → SAF
  if (Platform.OS === "android" && FileSystem.StorageAccessFramework) {
    const permission =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permission.granted) {
      const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permission.directoryUri,
        filename,
        "text/csv"
      );

      // escreve direto UTF-8 (SEM Base64)
      await FileSystem.writeAsStringAsync(targetUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return targetUri;
    }
  }

  // 3️⃣ Fallback universal (Expo Go / iOS)
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Compartilhamento não disponível");
  }

  await Sharing.shareAsync(tempUri, {
    mimeType: "text/csv",
    dialogTitle: "Exportar CSV",
  });

  return tempUri;
}

/* ================= EXPORT JSON ================= */

export async function exportJsonAndShare(
  data: any,
  filename = "export.json"
): Promise<string> {
  const uri = `${FileSystem.documentDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, JSON.stringify(data, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  await Sharing.shareAsync(uri, {
    mimeType: "application/json",
    dialogTitle: "Exportar JSON",
  });

  return uri;
}
