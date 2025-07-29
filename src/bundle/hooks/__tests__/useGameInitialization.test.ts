import { renderHook } from "@testing-library/react";
import { useGameInitialization } from "../useGameInitialization";

jest.mock("@/stores/game", () => ({
  useGameStore: jest.fn(() => ({
    initializeGame: jest.fn(),
  })),
}));

jest.mock("../useGameConfiguration", () => ({
  useGameConfiguration: jest.fn(() => ({
    gameConfig: { boardWidth: 10, boardHeight: 10 },
    isInitialized: false,
    isLoading: false,
    error: null,
    initializeGameConfig: jest.fn(),
    forceInitialization: jest.fn(),
  })),
}));

describe("useGameInitialization", () => {
  it("should return game configuration state", () => {
    const { result } = renderHook(() => useGameInitialization());

    expect(result.current).toHaveProperty("gameConfig");
    expect(result.current).toHaveProperty("isInitialized");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("initializeGameConfig");
    expect(result.current).toHaveProperty("forceInitialization");
  });
}); 