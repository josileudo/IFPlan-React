import { Simulation } from "@/types";

export const PDFTemplate = (data: Simulation) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const formatNumber = (value: number | null | undefined, digits = 2) => {
    if (value === null || value === undefined) return "-";
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  // Base64 logo from src/assets/icon.png
  const logoBase64 =
    "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";

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    :root {
      --primary: #059668;
      --text-main: #111827;
      --text-muted: #4b5563;
      --border: #e5e7eb;
      --bg: #ffffff;
    }

    body {
      font-family: 'Inter', sans-serif;
      color: var(--text-main);
      padding: 30px;
      line-height: 1.5;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 15px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .logo {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }

    .app-info {
        display: flex;
        flex-direction: column;
    }

    .app-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary);
    }

    .doc-type {
      font-size: 14px;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .meta-info {
      text-align: right;
      font-size: 14px;
      color: var(--text-muted);
    }

    .title-area {
        margin-bottom: 30px;
    }

    .main-title {
        font-size: 32px;
        font-weight: 800;
        margin: 0;
        color: var(--text-main);
    }

    .description-container {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .desc-item {
        font-size: 16px;
    }

    .desc-label {
        font-weight: 700;
        color: var(--primary);
        margin-right: 5px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary);
      margin: 30px 0 15px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 5px;
      text-transform: uppercase;
    }

    .data-list {
      margin-top: 10px;
    }

    .data-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
    }

    .data-row:last-child {
        border-bottom: none;
    }

    .data-key {
      font-size: 14px;
      color: var(--text-muted);
    }

    .data-val {
      font-size: 14px;
      font-weight: 600;
    }

    .unit {
        font-weight: 400;
        color: var(--text-muted);
        margin-left: 3px;
    }

    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }

    @media print {
        .section-title { break-after: avoid; }
        .data-list { break-before: avoid; }
        .data-row { break-inside: avoid; }
    }
  `;

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>${styles}</style>
    </head>
    <body>
      <div class="header">
        <div class="logo-container">
          <img class="logo" src="data:image/png;base64,${logoBase64}" alt="Logo" />
          <div class="app-info">
              <span class="app-name">IFPlan leite à pasto</span>
              <span class="doc-type">Relatório Técnico</span>
          </div>
        </div>
        <div class="meta-info">
          <div>Data: ${formatDate(data.date)}</div>
        </div>
      </div>

      <div class="title-area">
          <h1 class="main-title">Simulação</h1>
          <div class="description-container">
              <div class="desc-item">
                  <span class="desc-label">Título:</span>
                  <span>${data.name || "N/A"}</span>
              </div>
              <div class="desc-item">
                  <span class="desc-label">Descrição:</span>
                  <span>${data.description || "N/A"}</span>
              </div>
          </div>
      </div>

      <!-- ENTRADAS -->
      <div class="section-title">Dados de Entrada</div>
      
      <div class="data-list">
        <!-- Ambiente -->
        <div class="data-row"><span class="data-key">Temp. Mínima</span><span class="data-val">${formatNumber(
          data.inputs.temperaturaMinima,
          1
        )}<span class="unit">°C</span></span></div>
        <div class="data-row"><span class="data-key">Temp. Máxima</span><span class="data-val">${formatNumber(
          data.inputs.temperaturaMaxima,
          1
        )}<span class="unit">°C</span></span></div>
        <div class="data-row"><span class="data-key">Precipitação</span><span class="data-val">${formatNumber(
          data.inputs.precipitacao,
          1
        )}<span class="unit">mm/dia</span></span></div>
        <div class="data-row"><span class="data-key">Umidade Relativa</span><span class="data-val">${formatNumber(
          data.inputs.umidadeRelativa,
          1
        )}<span class="unit">%</span></span></div>
        <div class="data-row"><span class="data-key">Velocidade do Vento</span><span class="data-val">${formatNumber(
          data.inputs.velocidadeDoVento,
          1
        )}<span class="unit">m/s</span></span></div>
        
        <!-- Água e Solo -->
        <div class="data-row"><span class="data-key">Água Disponível</span><span class="data-val">${formatNumber(
          data.inputs.aguaDisponivelParaIrrigacao,
          0
        )}<span class="unit">m³/dia</span></span></div>
        <div class="data-row"><span class="data-key">Água Outros Usos</span><span class="data-val">${formatNumber(
          data.inputs.aguaDeOutrosUsos,
          0
        )}<span class="unit">L/mês</span></span></div>
        <div class="data-row"><span class="data-key">Dose de N</span><span class="data-val">${formatNumber(
          data.inputs.doseDeN,
          0
        )}<span class="unit">kg N/ha/ano</span></span></div>
        
        <!-- Propriedade -->
        <div class="data-row"><span class="data-key">Área</span><span class="data-val">${formatNumber(
          data.inputs.area,
          1
        )}<span class="unit">ha</span></span></div>
        <div class="data-row"><span class="data-key">Nº de Piquetes</span><span class="data-val">${formatNumber(
          data.inputs.numeroDePiquetes,
          0
        )}</span></div>
        
        <!-- Rebanho -->
        <div class="data-row"><span class="data-key">Peso Corporal</span><span class="data-val">${formatNumber(
          data.inputs.pesoCorporal,
          0
        )}<span class="unit">kg</span></span></div>
        <div class="data-row"><span class="data-key">Produção de Leite</span><span class="data-val">${formatNumber(
          data.inputs.producaoDeLeite,
          1
        )}<span class="unit">L/vaca/dia</span></span></div>
        <div class="data-row"><span class="data-key">Vacas em Lactação</span><span class="data-val">${formatNumber(
          data.inputs.vacasEmLactacao,
          1
        )}<span class="unit">%</span></span></div>
      </div>

      <!-- SAÍDAS -->
      <div class="section-title">Resultados Calculados</div>

      <div class="data-list">
        <div class="data-row"><span class="data-key">Produção Diária</span><span class="data-val">${formatNumber(
          data.results.producaoDiaria,
          0
        )}<span class="unit">L/dia</span></span></div>
        <div class="data-row"><span class="data-key">Produção Anual</span><span class="data-val">${formatNumber(
          data.results.producaoDeLeiteHaAno,
          0
        )}<span class="unit">L/ha/ano</span></span></div>
        <div class="data-row"><span class="data-key">Capacidade Suporte</span><span class="data-val">${formatNumber(
          data.results.capacidadeDeSuporte,
          1
        )}<span class="unit">animais</span></span></div>
        <div class="data-row"><span class="data-key">Taxa de Lotação</span><span class="data-val">${formatNumber(
          data.results.taxaDeLotacao,
          1
        )}<span class="unit">vacas/ha</span></span></div>
        <div class="data-row"><span class="data-key">Margem Líquida</span><span class="data-val">${formatNumber(
          data.results.ml,
          3
        )}<span class="unit">R$/L</span></span></div>
        <div class="data-row"><span class="data-key">TRCI (Rentabilidade)</span><span class="data-val">${formatNumber(
          data.results.trci,
          2
        )}<span class="unit">%</span></span></div>
        <div class="data-row"><span class="data-key">Payback</span><span class="data-val">${formatNumber(
          data.results.payback,
          1
        )}<span class="unit">anos</span></span></div>
        <div class="data-row"><span class="data-key">Pegada Hídrica</span><span class="data-val">${formatNumber(
          data.results.pegadaHidrica,
          1
        )}<span class="unit">L H2O/L leite</span></span></div>
        <div class="data-row"><span class="data-key">ITU</span><span class="data-val">${formatNumber(
          data.results.itu,
          1
        )}</span></div>
      </div>

      <div class="footer">
        Feito por IFPlan Leite á pasto
      </div>
    </body>
    </html>
  `;
};
