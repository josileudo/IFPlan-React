import { SimulationInput, SimulationOutput } from "../types";

export const calculateSimulation = (
  input: SimulationInput
): SimulationOutput => {
  // Helpers
  const _if = (condition: boolean, trueVal: number, falseVal: number) =>
    condition ? trueVal : falseVal;
  const pow = Math.pow;

  // 1. Environmental & Stress
  // itu: (0,8 * (Temperatura máxima + Temperatura mínima) / 2 + (Umidade relativa / 100) * ((Temperatura máxima + Temperatura mínima) / 2 - 14,4) + 46,4)
  const tm = (input.temperaturaMaxima + input.temperaturaMinima) / 2;
  const itu = 0.8 * tm + (input.umidadeRelativa / 100) * (tm - 14.4) + 46.4;

  // dpl: (-1,075 - (1,736 * Produção de leite) + (0,02474 * Produção de leite * ITU))
  const dpl =
    -1.075 -
    1.736 * input.producaoDeLeite +
    0.02474 * input.producaoDeLeite * itu;

  // eto: (((24,211 * Temperatura máxima - 635,46) / 30,4) + ((53,984 * Velocidade do vento + 10,898) / 30,4)) / 2
  const eto =
    ((24.211 * input.temperaturaMaxima - 635.46) / 30.4 +
      (53.984 * input.velocidadeDoVento + 10.898) / 30.4) /
    2;

  // 2. Water & Irrigation
  // Irrigação logic (Missing in JSON, assumed based on ETo and Precip)
  // Assuming minimal irrigation needed to meet ETo if Precip is insufficient.
  // This is a placeholder logic: Water Deficit = ETo - Precip.
  const irrigacaoNecessaria = Math.max(0, eto - input.precipitacao);
  const irrigacao = irrigacaoNecessaria; // Simplified

  // aguaAplicada: Precipitação + IF(((Água disponível para irrigação * 1000)/(Área * 10000)) >= Irrigação, Irrigação, (Água disponível para irrigação * 1000)/(Área * 10000))
  // Area in ha -> m2 = Area * 10000. AguaDisp m3/day -> L/day = * 1000.
  // Water supply in mm/day = (m3 * 1000) / (ha * 10000) = L / m2 = mm.
  const waterSupplyMm =
    (input.aguaDisponivelParaIrrigacao * 1000) / (input.area * 10000);
  const effectiveIrrigation =
    waterSupplyMm >= irrigacao ? irrigacao : waterSupplyMm;
  const aguaAplicada = input.precipitacao + effectiveIrrigation;

  // tensaoDaAguaNoSolo: 0,0368068 + (-1,06252 / Água aplicada)
  // Check div by zero
  const tensaoDaAguaNoSolo =
    aguaAplicada !== 0 ? 0.0368068 + -1.06252 / aguaAplicada : 0;

  // 3. Forage Production
  // producaoDeForragem: ((1,36722 + (-0,284546 * Tensão da água no solo) + (-2,13514 * Tensão da água no solo^2)) * ((100,31 + (0,1377 * Dose de N)) / (100,31 + (0,1377 * 1200)))) * Var FOR
  const term1 =
    1.36722 +
    -0.284546 * tensaoDaAguaNoSolo +
    -2.13514 * pow(tensaoDaAguaNoSolo, 2);
  const term2 = (100.31 + 0.1377 * input.doseDeN) / (100.31 + 0.1377 * 1200);
  const producaoDeForragem = term1 * term2 * input.varFOR;

  // forragemDisponivel: ((Produção de forragem * 10000) * (Área / Número de piquetes)) * 0,2
  // 10000 conversion implies kg/m2 to kg/ha? Or m2 to ha?
  // input.producaoDeForragem unit is kg MV/m2.
  // kg MV/m2 * 10000 m2/ha = kg MV/ha.
  // * (Area / Piquetes) = kg MV per piquete.
  // * 0.2 (Assume 20% Dry Matter or Usage Efficiency? "Var FOR" unit is Admensional, result unit kg MS/piquete).
  // Likely 0.2 is DM content or grazing efficiency.
  const forragemDisponivel =
    producaoDeForragem * 10000 * (input.area / input.numeroDePiquetes) * 0.2;

  // 4. Animal Consumption & Production
  // consumo: (-4,69 + (0,0142 * Peso corporal) + (0,356 * Produção de leite) + (1,72 * Teor de gordura no leite))
  const consumo =
    -4.69 +
    0.0142 * input.pesoCorporal +
    0.356 * input.producaoDeLeite +
    1.72 * input.teorDeGorduraNoLeite;

  // consumoDeNDT: ((((48,6 - (0,0183 * Peso corporal)) + (0,435 * Produção de leite) + (0,728 * Teor de gordura no leite) + (3,46 * Teor de PB no leite)) * 1,04) / 100) * Consumo
  const consumoDeNDT =
    (((48.6 -
      0.0183 * input.pesoCorporal +
      0.435 * input.producaoDeLeite +
      0.728 * input.teorDeGorduraNoLeite +
      3.46 * input.teorDePBNoLeite) *
      1.04) /
      100) *
    consumo;

  // ndtDH: (0,00048 * Peso corporal * (Deslocamento horizontal / 1000)) * 0,43
  const ndtDH =
    0.00048 * input.pesoCorporal * (input.deslocamentoHorizontal / 1000) * 0.43;

  // ndtDV: IF(Deslocamento vertical > 0, 0,00669 * Peso corporal * (Deslocamento vertical / 1000), 0) * 0,43
  const ndtDVRaw =
    input.deslocamentoVertical > 0
      ? 0.00669 * input.pesoCorporal * (input.deslocamentoVertical / 1000)
      : 0;
  const ndtDV = ndtDVRaw * 0.43;

  const ndtDeslocamento = ndtDH + ndtDV; // Implicit sum for total displacement NDT

  // consumoTotal: (Consumo + ((NDT deslocamento / Consumo de NDT) * Consumo)) * Var MS
  // Avoid div by zero
  const consumoTotal =
    (consumo +
      (consumoDeNDT !== 0 ? (ndtDeslocamento / consumoDeNDT) * consumo : 0)) *
    input.varMS;

  // suplementacao: Not defined in formulas? Used in Capacidade.
  // Assumption: Standard calculation or 0 if not provided. Input doesn't have it.
  // Using 0 as placeholder.

  // "Produção de leite (L/vaca/dia)" / 2,5
  const suplementacao = input.producaoDeLeite / 2.5;

  // capacidadeDeSuporte: (Forragem disponível * 0,95) / (Consumo total - Suplementação) (OK)
  const capacidadeDeSuporte =
    (forragemDisponivel * 0.95) / (consumoTotal - suplementacao);

  // producaoDiaria: ((Produção de leite - (DPL * Var DPL)) * (Capacidade de suporte * (Vacas em lactação / 100)))
  // DPL * Var DPL -> Loss per cow.
  // Prod per cow adjusted = (Prod - Loss).
  // Total cows = Capacitade * %Lactation.
  const producaoDiaria =
    (input.producaoDeLeite - dpl * input.varDPL) *
    (capacidadeDeSuporte * (input.vacasEmLactacao / 100)); // OK

  // Derived productions
  const producaoTotalAno = producaoDiaria * 365; // L/year
  const producaoDeLeiteHaDia = producaoDiaria / input.area;
  const producaoDeLeiteHaAno = producaoTotalAno / input.area;

  // 5. Economics
  // coe: (4,52816 + (-0,000142 * Produção diária) + (7,67199e-09 * Produção diária^2) + (-0,24042 * Produção de leite) + (0,004937 * Produção de leite^2)) * Var COE
  const coe =
    (4.52816 +
      -0.000142 * producaoDiaria +
      0.00000000767199 * pow(producaoDiaria, 2) +
      -0.24042 * input.producaoDeLeite +
      0.004937 * pow(input.producaoDeLeite, 2)) *
    input.varCOE;

  // investimentoTotal: Deduced: InvestimentoPorL * Produção Diária (Capacity)
  const investimentoTotal = input.investimentoPorL * producaoDiaria;

  // depreciacao: Investimento por L * (Taxa de depreciação / 365) -> R$/L OK
  const depreciacao =
    input.investimentoPorL * (input.taxaDeDepreciacao / 100 / 365); // Taxa is %a.a., need /100? Input says "6.667". Assuming it's %, so /100.

  // mdoFamiliar: Renda familiar / (Produção diária * 30,4)
  const mdoFamiliar = input.rendaFamiliar / (producaoDiaria * 30.4); // OK

  // cot: COE + MDO familiar + Depreciação
  const cot = coe + mdoFamiliar + depreciacao;

  // precoDoLeite: ((0,631922 * Produção diária^0,102383) + (-0,0132 * Teor de gordura no leite^2 + 0,1384 * Teor de gordura no leite - 0,3089)) * Var Preço
  const precoDoLeite =
    (0.631922 * pow(producaoDiaria, 0.102383) +
      (-0.0132 * pow(input.teorDeGorduraNoLeite, 2) +
        0.1384 * input.teorDeGorduraNoLeite -
        0.3089)) *
    input.varPreco;

  // ml: Preço do leite - COT
  const ml = precoDoLeite - cot;

  // mlAnual: ML * Produção Anual
  const mlAnual = ml * producaoTotalAno;

  // mlPorArea: ML Anual / Area
  const mlPorArea = mlAnual / input.area;

  // coeTotal: COE * Produção Anual
  const coeTotal = coe * producaoTotalAno;

  // receitaTotalAno
  const receitaTotalAno = precoDoLeite * producaoTotalAno;
  const receitaTotalMes = receitaTotalAno / 12;
  const receitaPorArea = receitaTotalAno / input.area;

  // perdaDeReceitaComEstresse: Deduced
  // Loss in L/cow/day = DPL * VarDPL
  // Total Loss L/day = Loss/cow * (Capacidade * VacasEmLactacao/100)
  // Total Loss R$/year = Loss L/day * 365 * PrecoDoLeite
  const perCowLoss = dpl * input.varDPL;
  const totalCows = capacidadeDeSuporte * (input.vacasEmLactacao / 100);
  const totalLossLDay = perCowLoss * totalCows;
  const perdaDeReceitaComEstresse = totalLossLDay * 365 * precoDoLeite;

  // pegadaHidrica: (((Água aplicada * 10000) * Área) + (Água de outros usos / 30,4)) / Produção diária
  // Agua aplicada mm/day = L/m2/day. * 10000 = L/ha/day. * Area = L/day (Irrigation).
  // Agua outros usos L/month / 30.4 = L/day.
  const pegadaHidrica =
    (aguaAplicada * 10000 * input.area + input.aguaDeOutrosUsos / 30.4) /
    producaoDiaria;

  // participacaoDaIrrigacaoNaAgua: %
  const totalWater =
    aguaAplicada * 10000 * input.area + input.aguaDeOutrosUsos / 30.4;
  const irrigationWater = aguaAplicada * 10000 * input.area;
  const participacaoDaIrrigacaoNaAgua = (irrigationWater / totalWater) * 100;

  // payback: Anos. InvestimentoTotal / ML Anual
  const payback = mlAnual !== 0 ? investimentoTotal / mlAnual : 0;
  console.log("payback", payback);
  console.log("mlAnual", mlAnual);
  console.log("investimentoTotal", investimentoTotal);

  // trci: Taxa de Retorno do Capital Investido (% a.a). ML Anual / Investimento Total * 100
  const trci =
    investimentoTotal !== 0 ? (mlAnual / investimentoTotal) * 100 : 0;

  // taxaDeLotacao: Vacas / ha.
  // Total cows / Area
  const taxaDeLotacao = totalCows / input.area;

  return {
    aguaAplicada,
    capacidadeDeSuporte,
    coe,
    coeTotal,
    consumo,
    consumoDeNDT,
    consumoTotal,
    cot,
    depreciacao,
    dpl: dpl * input.varDPL, // Maybe return the adjusted DPL or raw? Keeping consistent with usage.
    dplAnual: dpl * input.varDPL * 365,
    eto,
    forragemDisponivel,
    investimentoTotal,
    irrigacao,
    itu,
    mdoFamiliar,
    ml,
    mlAnual,
    mlPorArea,
    ndtDeslocamento,
    ndtDH,
    ndtDV,
    participacaoDaIrrigacaoNaAgua,
    payback,
    pegadaHidrica,
    perdaDeReceitaComEstresse,
    precoDoLeite,
    producaoDeForragem,
    producaoDeLeiteHaAno,
    producaoDeLeiteHaDia,
    producaoDiaria,
    receitaPorArea,
    receitaTotalAno,
    receitaTotalMes,
    suplementacao,
    taxaDeLotacao,
    tensaoDaAguaNoSolo,
    trci,
  };
};
