import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { Simulation, SimulationInput, SimulationOutput } from "../types";
import { calculateSimulation } from "../utils/formulas";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

interface StoreState {
  simulations: Simulation[];
  hasSeenOnboarding: boolean;
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
  completeOnboarding: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      simulations: [],
      hasSeenOnboarding: false,
      addSimulation: (name, description, input) => {
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
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
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
