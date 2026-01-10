import { SimulationSchema } from "./schema";

export const STEP_FIELDS: Record<number, (keyof SimulationSchema)[]> = {
  0: ["name", "description"],
  1: [
    "temperaturaMinima",
    "temperaturaMaxima",
    "precipitacao",
    "umidadeRelativa",
    "velocidadeDoVento",
  ],
  2: ["aguaDisponivelParaIrrigacao", "aguaDeOutrosUsos", "doseDeN"],
  3: [
    "area",
    "numeroDePiquetes",
    "deslocamentoHorizontal",
    "deslocamentoVertical",
  ],
  4: [
    "pesoCorporal",
    "producaoDeLeite",
    "teorDeGorduraNoLeite",
    "teorDePBNoLeite",
    "vacasEmLactacao",
  ],
  5: ["investimentoPorL", "rendaFamiliar", "taxaDeDepreciacao"],
};

export const STEPS = [
  { title: "Identificação", key: "identification" },
  { title: "Ambiente", key: "environment" },
  { title: "Água e Solo", key: "water_soil" },
  { title: "Propriedade", key: "property" },
  { title: "Rebanho", key: "herd" },
  { title: "Econômico", key: "economic" },
];
