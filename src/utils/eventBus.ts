type EventCallback = (...args: unknown[]) => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit(event: string, ...args: unknown[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(...args));
  }

  clear(): void {
    this.events = {};
  }
}

export const eventBus = new EventBus();

export const EVENTS = {
  CAMERA_SHOOT_START: "camera_shoot_start",
  CAMERA_SHOOT_END: "camera_shoot_end",
  CAMERA_TOGGLE_PLAYER_PERSPECTIVE: "camera_toggle_player_perspective",
} as const;

export type EventType = (typeof EVENTS)[keyof typeof EVENTS];
