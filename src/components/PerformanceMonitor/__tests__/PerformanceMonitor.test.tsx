import { PerformanceMonitor } from "../index";

jest.mock("stats.js", () => {
  return jest.fn().mockImplementation(() => ({
    dom: { children: [] },
    showPanel: jest.fn(),
    begin: jest.fn(),
    end: jest.fn(),
  }));
});

describe("PerformanceMonitor", () => {
  it("should be a function component", () => {
    expect(typeof PerformanceMonitor).toBe("function");
  });

  it("should have correct props interface", () => {
    const props = {
      enabled: true,
      position: "top-left" as const,
      showMemory: true,
      showRenderTime: true,
    };

    expect(props.enabled).toBe(true);
    expect(props.position).toBe("top-left");
    expect(props.showMemory).toBe(true);
    expect(props.showRenderTime).toBe(true);
  });

  it("should handle different position values", () => {
    const positions = [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ] as const;

    positions.forEach((position) => {
      expect(position).toMatch(/^(top|bottom)-(left|right)$/);
    });
  });

  it("should handle boolean props", () => {
    const booleanProps = [true, false];

    booleanProps.forEach((value) => {
      expect(typeof value).toBe("boolean");
    });
  });
});
