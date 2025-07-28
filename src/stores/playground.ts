import { create } from "zustand";

interface PlaygroundState {
  freeCameraMovement: boolean;
  setFreeCameraMovement: (enabled: boolean) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  freeCameraMovement: true,
  setFreeCameraMovement: (enabled: boolean) => set({ freeCameraMovement: enabled }),
})); 