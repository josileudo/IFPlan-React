export interface SimulationInput {
  aguaDeOutrosUsos: number;
  aguaDisponivelParaIrrigacao: number;
  area: number;
  deslocamentoHorizontal: number;
  deslocamentoVertical: number;
  doseDeN: number;
  investimentoPorL: number;
  numeroDePiquetes: number;
  pesoCorporal: number;
  precipitacao: number;
  producaoDeLeite: number;
  rendaFamiliar: number;
  taxaDeDepreciacao: number;
  temperaturaMaxima: number;
  temperaturaMinima: number;
  teorDeGorduraNoLeite: number;
  teorDePBNoLeite: number;
  umidadeRelativa: number;
  vacasEmLactacao: number;
  varCOE: number;
  varDPL: number;
  varFOR: number;
  varMS: number;
  varPreco: number;
  velocidadeDoVento: number;
}

export interface SimulationOutput {
  aguaAplicada: number | null;
  capacidadeDeSuporte: number | null;
  coe: number | null;
  coeTotal: number | null;
  consumo: number | null;
  consumoDeNDT: number | null;
  consumoTotal: number | null;
  cot: number | null;
  depreciacao: number | null;
  dpl: number | null;
  dplAnual: number | null;
  eto: number | null;
  forragemDisponivel: number | null;
  investimentoTotal: number | null;
  irrigacao: number | null;
  itu: number | null;
  mdoFamiliar: number | null;
  ml: number | null;
  mlAnual: number | null;
  mlPorArea: number | null;
  ndtDeslocamento: number | null;
  ndtDH: number | null;
  ndtDV: number | null;
  participacaoDaIrrigacaoNaAgua: number | null;
  payback: number | null;
  pegadaHidrica: number | null;
  perdaDeReceitaComEstresse: number | null;
  precoDoLeite: number | null;
  producaoDeForragem: number | null;
  producaoDeLeiteHaAno: number | null;
  producaoDeLeiteHaDia: number | null;
  producaoDiaria: number | null;
  receitaPorArea: number | null;
  receitaTotalAno: number | null;
  receitaTotalMes: number | null;
  suplementacao: number | null;
  taxaDeLotacao: number | null;
  tensaoDaAguaNoSolo: number | null;
  trci: number | null;
}

export interface Simulation {
  id: string;
  name?: string;
  description?: string;
  date: string;
  inputs: SimulationInput;
  results: SimulationOutput;
}

export const InitialInputs: SimulationInput = {
  aguaDeOutrosUsos: 50000,
  aguaDisponivelParaIrrigacao: 3000,
  area: 50,
  deslocamentoHorizontal: 5000,
  deslocamentoVertical: 300,
  doseDeN: 1200,
  investimentoPorL: 750,
  numeroDePiquetes: 24,
  pesoCorporal: 450,
  precipitacao: 2.027,
  producaoDeLeite: 18,
  rendaFamiliar: 5000,
  taxaDeDepreciacao: 6.667,
  temperaturaMaxima: 34.3,
  temperaturaMinima: 21.5,
  teorDeGorduraNoLeite: 3.8,
  teorDePBNoLeite: 3.2,
  umidadeRelativa: 63.6,
  vacasEmLactacao: 78,
  varCOE: 1.4,
  varDPL: 1,
  varFOR: 1,
  varMS: 1,
  varPreco: 1.35,
  velocidadeDoVento: 3.6,
};
