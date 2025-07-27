import { create } from "zustand";

interface TestingState {
  freeCameraMovement: boolean;
  setFreeCameraMovement: (enabled: boolean) => void;
}

export const useTestingStore = create<TestingState>((set) => ({
  freeCameraMovement: true,
  setFreeCameraMovement: (enabled: boolean) => set({ freeCameraMovement: enabled }),
})); 