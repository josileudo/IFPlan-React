// utils/exportCsv.ts
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

async function saveFile(uri: any, filename: string, mimetype: string) {
  if (Platform.OS === "android") {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        mimetype
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e) => console.log(e));
    } else {
      await Sharing.shareAsync(uri);
    }
  } else {
    await Sharing.shareAsync(uri);
  }
}

/**
 * Converte array de objetos em CSV.
 * @param rows Array de objetos homogêneos
 * @param columns Optional: array de chaves/headers. Ex: [{key: 'name', label: 'Nome'}]
 */
export function toCsv(
  rows: Record<string, any>[],
  columns?: { key: string; label: string }[]
) {
  if (!rows || rows.length === 0) return "";

  // se columns não definido, extrai chaves do primeiro objeto
  const keys = columns ? columns.map((c) => c.key) : Object.keys(rows[0]);
  const headers = columns ? columns.map((c) => c.label) : keys;

  // escape e formata valores
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    // normaliza número (ponto decimal) se precisar
    const s = String(v);
    // se conter " ou , ou \n, colocar entre aspas e escapá-las
    const needQuote = /[",\n]/.test(s);
    const escaped = s.replace(/"/g, '""');
    return needQuote ? `"${escaped}"` : escaped;
  };

  const lines = [];
  lines.push(headers.join(",")); // header
  for (const row of rows) {
    const line = keys.map((k) => escape(row[k])).join(",");
    lines.push(line);
  }
  return lines.join("\r\n");
}

/**
 * Salva CSV e abre menu de compartilhamento
 * @param rows array de objetos
 * @param filename ex: "simulacao.csv"
 * @param columns optional columns
 */
export async function exportCsvAndShare(
  rows: Record<string, any>[],
  filename = "export.csv",
  columns?: { key: string; label: string }[]
) {
  try {
    const csv = toCsv(rows, columns);

    // BOM para Excel (UTF-8) para abrir corretamente com acentuação
    const bom = "\uFEFF";
    const csvWithBom = bom + csv;

    const fileUri = `${(FileSystem as any).documentDirectory}${filename}`;

    // Baixar o arquivo local e depois compartilhar
    await saveFile(fileUri, filename, "text/csv");

    // gravar o arquivo (overwrite)
    await FileSystem.writeAsStringAsync(fileUri, csvWithBom, {
      encoding: "utf8", // FileSystem.EncodingType.UTF8
    });

    // abrir menu de compartilhamento nativo
    if (!(await Sharing.isAvailableAsync())) {
      // se sharing não disponível, você pode abrir com Linking.openURL(fileUri) em alguns casos
      throw new Error("Compartilhamento não disponível neste dispositivo.");
    }

    await Sharing.shareAsync(fileUri, { mimeType: "text/csv" });
    return fileUri;
  } catch (err) {
    console.error("exportCsv error", err);
    throw err;
  }
}

/**
 * Salva JSON e abre menu de compartilhamento
 * @param data objeto ou array de objetos
 * @param filename ex: "simulacao.json"
 */
export async function exportJsonAndShare(data: any, filename = "export.json") {
  try {
    const json = JSON.stringify(data, null, 2);
    const fileUri = `${(FileSystem as any).documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: "utf8",
    });

    if (!(await Sharing.isAvailableAsync())) {
      throw new Error("Compartilhamento não disponível neste dispositivo.");
    }

    await Sharing.shareAsync(fileUri, { mimeType: "application/json" });
    return fileUri;
  } catch (err) {
    console.error("exportJson error", err);
    throw err;
  }
}
