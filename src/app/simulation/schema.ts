import { z } from "zod";

// Helper for numeric inputs that come as strings or strictly numbers
const numberInput = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((val) => (val === undefined || val === null ? "" : String(val)))
  .refine((val) => val.trim().length > 0, { message: "Campo obrigatório" })
  .transform((val) => Number(val.replace(",", ".")))
  .refine((n) => !isNaN(n), { message: "Número inválido" })
  .refine((n) => n >= 0, { message: "Número deve ser maior ou igual a 0" });

export const simulationSchema = z.object({
  // Identificação
  name: z.string().min(1, "O nome da simulação é obrigatório"),
  description: z.string().optional(),

  // Ambiente
  temperaturaMinima: numberInput,
  temperaturaMaxima: numberInput,
  precipitacao: numberInput,
  umidadeRelativa: numberInput,
  velocidadeDoVento: numberInput,

  // Água e Solo
  aguaDisponivelParaIrrigacao: numberInput,
  aguaDeOutrosUsos: numberInput,
  doseDeN: numberInput,

  // Propriedade
  area: numberInput,
  numeroDePiquetes: numberInput,
  deslocamentoHorizontal: numberInput,
  deslocamentoVertical: numberInput,

  // Rebanho
  pesoCorporal: numberInput,
  producaoDeLeite: numberInput,
  teorDeGorduraNoLeite: numberInput,
  teorDePBNoLeite: numberInput,
  vacasEmLactacao: numberInput,

  // Econômico
  investimentoPorL: numberInput,
  rendaFamiliar: numberInput,
  taxaDeDepreciacao: numberInput,

  // Vars (Hidden inputs, but good to validate if we ever expose them)
  varCOE: z.number().optional(),
  varDPL: z.number().optional(),
  varFOR: z.number().optional(),
  varMS: z.number().optional(),
  varPreco: z.number().optional(),
});

export type SimulationSchema = z.infer<typeof simulationSchema>;
