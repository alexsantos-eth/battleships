import { renderHook, act } from "@testing-library/react";
import { useGameConfiguration } from "../useGameConfiguration";
import { useNavigate, useSearchParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockSearchParams = {
  get: jest.fn(),
};

describe("useGameConfiguration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);
  });

  describe("mapUrlParamsToGameConfig", () => {
    it("should map URL parameters to game config correctly", () => {
      const { result } = renderHook(() => useGameConfiguration());

      act(() => {
        const config = result.current.mapUrlParamsToGameConfig(10, {
          small: 2,
          medium: 1,
          large: 1,
          xlarge: 0,
        }, "hard");

        expect(config).toEqual({
          boardWidth: 10,
          boardHeight: 10,
          shipCounts: {
            small: 2,
            medium: 1,
            large: 1,
            xlarge: 0,
          },
          enemyAI: "smart",
          initialTurn: "enemy",
        });
      });
    });

    it("should use default values when ships are not provided", () => {
      const { result } = renderHook(() => useGameConfiguration());

      act(() => {
        const config = result.current.mapUrlParamsToGameConfig(8, {}, "medium");

        expect(config).toEqual({
          boardWidth: 8,
          boardHeight: 8,
          shipCounts: {
            small: 1,
            medium: 1,
            large: 1,
            xlarge: 1,
          },
          enemyAI: "random",
          initialTurn: "random",
        });
      });
    });
  });

  describe("parseUrlParams", () => {
    it("should parse URL parameters correctly", () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        switch (key) {
          case "gridSize":
            return "12";
          case "ships":
            return JSON.stringify({ small: 3, medium: 2, large: 1, xlarge: 1 });
          case "difficulty":
            return "hard";
          default:
            return null;
        }
      });

      const { result } = renderHook(() => useGameConfiguration());

      act(() => {
        const config = result.current.parseUrlParams();

        expect(config).toEqual({
          boardWidth: 12,
          boardHeight: 12,
          shipCounts: {
            small: 3,
            medium: 2,
            large: 1,
            xlarge: 1,
          },
          enemyAI: "smart",
          initialTurn: "enemy",
        });
      });
    });

    it("should throw error when ships parameter is missing", () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        switch (key) {
          case "gridSize":
            return "10";
          case "ships":
            return null;
          case "difficulty":
            return "medium";
          default:
            return null;
        }
      });

      const { result } = renderHook(() => useGameConfiguration());

      act(() => {
        expect(() => result.current.parseUrlParams()).toThrow("Parámetros de barcos no encontrados");
      });
    });

    it("should throw error when ships parameter is invalid JSON", () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        switch (key) {
          case "gridSize":
            return "10";
          case "ships":
            return "invalid-json";
          case "difficulty":
            return "medium";
          default:
            return null;
        }
      });

      const { result } = renderHook(() => useGameConfiguration());

      act(() => {
        expect(() => result.current.parseUrlParams()).toThrow("Error al parsear configuración de barcos");
      });
    });
  });

  describe("initializeGameConfig", () => {
    it("should initialize game config successfully", async () => {
      const mockInitializeGame = jest.fn();
      mockSearchParams.get.mockImplementation((key: string) => {
        switch (key) {
          case "gridSize":
            return "10";
          case "ships":
            return JSON.stringify({ small: 1, medium: 1, large: 1, xlarge: 1 });
          case "difficulty":
            return "medium";
          default:
            return null;
        }
      });

      const { result } = renderHook(() => useGameConfiguration());

      await act(async () => {
        await result.current.initializeGameConfig(mockInitializeGame);
      });

      expect(mockInitializeGame).toHaveBeenCalledWith({
        boardWidth: 10,
        boardHeight: 10,
        shipCounts: {
          small: 1,
          medium: 1,
          large: 1,
          xlarge: 1,
        },
        enemyAI: "random",
        initialTurn: "random",
      });
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should handle initialization errors", async () => {
      const mockInitializeGame = jest.fn().mockImplementation(() => {
        throw new Error("Initialization failed");
      });

      mockSearchParams.get.mockImplementation((key: string) => {
        switch (key) {
          case "gridSize":
            return "10";
          case "ships":
            return JSON.stringify({ small: 1, medium: 1, large: 1, xlarge: 1 });
          case "difficulty":
            return "medium";
          default:
            return null;
        }
      });

      const { result } = renderHook(() => useGameConfiguration());

      await act(async () => {
        await result.current.initializeGameConfig(mockInitializeGame);
      });

      expect(mockNavigate).toHaveBeenCalledWith("/");
      expect(result.current.error).toBe("Error desconocido");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isInitialized).toBe(false);
    });
  });

  describe("forceInitialization", () => {
    it("should force initialization with existing config", async () => {
      const mockInitializeGame = jest.fn();
      
      mockSearchParams.get.mockImplementation((key: string) => {
        switch (key) {
          case "gridSize":
            return "10";
          case "ships":
            return JSON.stringify({ small: 1, medium: 1, large: 1, xlarge: 1 });
          case "difficulty":
            return "medium";
          default:
            return null;
        }
      });

      const { result } = renderHook(() => useGameConfiguration());

      await act(async () => {
        await result.current.initializeGameConfig(mockInitializeGame);
      });

      const mockForceInitializeGame = jest.fn();
      
      await act(async () => {
        await result.current.forceInitialization(mockForceInitializeGame);
      });

      expect(mockForceInitializeGame).toHaveBeenCalledWith(result.current.gameConfig);
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should not force initialization if no config exists", async () => {
      const mockInitializeGame = jest.fn();
      const { result } = renderHook(() => useGameConfiguration());

      await act(async () => {
        await result.current.forceInitialization(mockInitializeGame);
      });

      expect(mockInitializeGame).not.toHaveBeenCalled();
    });
  });
}); 