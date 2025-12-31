import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Simulation, SimulationInput, SimulationOutput } from "../types";
import { calculateSimulation } from "../utils/formulas";
import AsyncStorage from "@react-native-async-storage/async-storage";

const zustandStorage = {
  setItem: (name: string, value: string) => AsyncStorage.setItem(name, value),
  getItem: (name: string) => {
    const value = AsyncStorage.getItem(name);
    return value ?? null;
  },
  removeItem: (name: string) => AsyncStorage.removeItem(name),
};

interface StoreState {
  simulations: Simulation[];
  addSimulation: (
    name: string,
    description: string,
    input: SimulationInput
  ) => void;
  updateSimulation: (id: string, input: SimulationInput) => void;
  updateSimulationDetails: (
    id: string,
    name: string,
    description: string
  ) => void;
  deleteSimulation: (id: string) => void;
  getSimulation: (id: string) => Simulation | undefined;
  clearSimulations: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      simulations: [],
      addSimulation: (name, description, input) => {
        console.log("*** store - input", input);
        const results = calculateSimulation(input);
        const newSimulation: Simulation = {
          id: Date.now().toString(),
          name,
          description,
          date: new Date().toISOString(),
          inputs: input,
          results,
        };
        set((state) => ({
          simulations: [newSimulation, ...state.simulations],
        }));
      },
      updateSimulation: (id, input) => {
        const results = calculateSimulation(input);
        set((state) => ({
          simulations: state.simulations.map((sim) =>
            sim.id === id ? { ...sim, inputs: input, results } : sim
          ),
        }));
      },
      updateSimulationDetails: (id, name, description) => {
        set((state) => ({
          simulations: state.simulations.map((sim) =>
            sim.id === id ? { ...sim, name, description } : sim
          ),
        }));
      },
      clearSimulations: () => set({ simulations: [] }),
      deleteSimulation: (id) =>
        set((state) => ({
          simulations: state.simulations.filter((s) => s.id !== id),
        })),
      getSimulation: (id) => get().simulations.find((s) => s.id === id),
    }),
    {
      name: "ifplan-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
