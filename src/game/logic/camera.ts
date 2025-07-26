export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export interface CameraRotation {
  x: number;
  y: number;
  z: number;
}

export interface CameraState {
  position: CameraPosition;
  rotation: CameraRotation;
}

export const PLAYER_CAMERA_POSITION = {
  position: { x: 0, y: -6, z: 5 },
  rotation: { x: 1.1, y: 0, z: 0 },
};

export const ENEMY_CAMERA_POSITION = {
  position: { x: 0, y: 9, z: 5 },
  rotation: { x: 0, y: 0, z: 0 },
};

export const PLAYER_PERSPECTIVE_POSITION = {
  position: { x: 0, y: 0, z: 5 },
  rotation: { x: 0, y: 0, z: 0 },
};

export class CameraController {
  private currentState: CameraState;
  private isPlayerPerspective: boolean = false;

  constructor(initialState: CameraState = PLAYER_CAMERA_POSITION) {
    this.currentState = { ...initialState };
  }

  getCurrentState(): CameraState {
    return { ...this.currentState };
  }

  setPlayerPerspective(enabled: boolean): CameraState {
    this.isPlayerPerspective = enabled;
    
    if (enabled) {
      this.currentState = { ...PLAYER_PERSPECTIVE_POSITION };
    } else {
      this.currentState = { ...PLAYER_CAMERA_POSITION };
    }
    
    return this.getCurrentState();
  }

  moveToEnemyPosition(): CameraState {
    this.currentState = { ...ENEMY_CAMERA_POSITION };
    return this.getCurrentState();
  }

  moveToPlayerPosition(): CameraState {
    if (this.isPlayerPerspective) {
      this.currentState = { ...PLAYER_PERSPECTIVE_POSITION };
    } else {
      this.currentState = { ...PLAYER_CAMERA_POSITION };
    }
    return this.getCurrentState();
  }

  isInPlayerPerspective(): boolean {
    return this.isPlayerPerspective;
  }

  calculateDistance(from: CameraPosition, to: CameraPosition): number {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  calculateRotationDistance(from: CameraRotation, to: CameraRotation): number {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y) + Math.abs(from.z - to.z);
  }

  interpolatePosition(from: CameraPosition, to: CameraPosition, factor: number): CameraPosition {
    return {
      x: from.x + (to.x - from.x) * factor,
      y: from.y + (to.y - from.y) * factor,
      z: from.z + (to.z - from.z) * factor,
    };
  }

  interpolateRotation(from: CameraRotation, to: CameraRotation, factor: number): CameraRotation {
    return {
      x: from.x + (to.x - from.x) * factor,
      y: from.y + (to.y - from.y) * factor,
      z: from.z + (to.z - from.z) * factor,
    };
  }
} 