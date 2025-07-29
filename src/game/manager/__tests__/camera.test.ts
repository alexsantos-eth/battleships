import { 
  CameraController, 
  PLAYER_CAMERA_POSITION,
  ENEMY_CAMERA_POSITION,
  PLAYER_PERSPECTIVE_POSITION
} from '../camera';
import type { 
  CameraPosition, 
  CameraRotation, 
  CameraState
} from '../camera';

describe('Camera Logic', () => {
  describe('Camera Constants', () => {
    it('should have valid player camera position', () => {
      expect(PLAYER_CAMERA_POSITION.position).toEqual({ x: 0, y: -6, z: 5 });
      expect(PLAYER_CAMERA_POSITION.rotation).toEqual({ x: 1.1, y: 0, z: 0 });
    });

    it('should have valid enemy camera position', () => {
      expect(ENEMY_CAMERA_POSITION.position).toEqual({ x: 0, y: 9, z: 5 });
      expect(ENEMY_CAMERA_POSITION.rotation).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should have valid player perspective position', () => {
      expect(PLAYER_PERSPECTIVE_POSITION.position).toEqual({ x: 0, y: 0, z: 5 });
      expect(PLAYER_PERSPECTIVE_POSITION.rotation).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should have consistent camera state structure', () => {
      const positions = [PLAYER_CAMERA_POSITION, ENEMY_CAMERA_POSITION, PLAYER_PERSPECTIVE_POSITION];
      
      positions.forEach(pos => {
        expect(pos).toHaveProperty('position');
        expect(pos).toHaveProperty('rotation');
        expect(pos.position).toHaveProperty('x');
        expect(pos.position).toHaveProperty('y');
        expect(pos.position).toHaveProperty('z');
        expect(pos.rotation).toHaveProperty('x');
        expect(pos.rotation).toHaveProperty('y');
        expect(pos.rotation).toHaveProperty('z');
      });
    });
  });

  describe('CameraController', () => {
    let cameraController: CameraController;

    beforeEach(() => {
      cameraController = new CameraController();
    });

    describe('Initialization', () => {
      it('should initialize with default player camera position', () => {
        const state = cameraController.getCurrentState();
        expect(state).toEqual(PLAYER_CAMERA_POSITION);
      });

      it('should initialize with custom state', () => {
        const customState: CameraState = {
          position: { x: 10, y: 20, z: 30 },
          rotation: { x: 0.5, y: 1.0, z: 1.5 }
        };
        const customController = new CameraController(customState);
        expect(customController.getCurrentState()).toEqual(customState);
      });

      it('should not be in player perspective by default', () => {
        expect(cameraController.isInPlayerPerspective()).toBe(false);
      });
    });

    describe('State Management', () => {
      it('should return a copy of current state', () => {
        const state1 = cameraController.getCurrentState();
        const state2 = cameraController.getCurrentState();
        
        expect(state1).toEqual(state2);
        expect(state1).not.toBe(state2); // Should be different objects
      });

      it('should maintain state immutability', () => {
        const originalState = cameraController.getCurrentState();
        const stateCopy = cameraController.getCurrentState();
        
        // Modify the copy
        stateCopy.position.x = 999;
        stateCopy.rotation.y = 999;
        
        // Original state should remain unchanged
        expect(cameraController.getCurrentState()).toEqual(originalState);
      });
    });

    describe('Player Perspective', () => {
      it('should enable player perspective', () => {
        const newState = cameraController.setPlayerPerspective(true);
        
        expect(cameraController.isInPlayerPerspective()).toBe(true);
        expect(newState).toEqual(PLAYER_PERSPECTIVE_POSITION);
      });

      it('should disable player perspective', () => {
        cameraController.setPlayerPerspective(true);
        const newState = cameraController.setPlayerPerspective(false);
        
        expect(cameraController.isInPlayerPerspective()).toBe(false);
        expect(newState).toEqual(PLAYER_CAMERA_POSITION);
      });

      it('should toggle player perspective correctly', () => {
        expect(cameraController.isInPlayerPerspective()).toBe(false);
        
        cameraController.setPlayerPerspective(true);
        expect(cameraController.isInPlayerPerspective()).toBe(true);
        
        cameraController.setPlayerPerspective(false);
        expect(cameraController.isInPlayerPerspective()).toBe(false);
      });
    });

    describe('Camera Movement', () => {
      it('should move to enemy position', () => {
        const newState = cameraController.moveToEnemyPosition();
        
        expect(newState).toEqual(ENEMY_CAMERA_POSITION);
        expect(cameraController.getCurrentState()).toEqual(ENEMY_CAMERA_POSITION);
      });

      it('should move to player position (normal perspective)', () => {
        const newState = cameraController.moveToPlayerPosition();
        
        expect(newState).toEqual(PLAYER_CAMERA_POSITION);
        expect(cameraController.getCurrentState()).toEqual(PLAYER_CAMERA_POSITION);
      });

      it('should move to player perspective when enabled', () => {
        cameraController.setPlayerPerspective(true);
        const newState = cameraController.moveToPlayerPosition();
        
        expect(newState).toEqual(PLAYER_PERSPECTIVE_POSITION);
        expect(cameraController.getCurrentState()).toEqual(PLAYER_PERSPECTIVE_POSITION);
      });

      it('should handle multiple movements correctly', () => {
        // Move to enemy
        cameraController.moveToEnemyPosition();
        expect(cameraController.getCurrentState()).toEqual(ENEMY_CAMERA_POSITION);
        
        // Move to player
        cameraController.moveToPlayerPosition();
        expect(cameraController.getCurrentState()).toEqual(PLAYER_CAMERA_POSITION);
        
        // Enable perspective and move to player
        cameraController.setPlayerPerspective(true);
        cameraController.moveToPlayerPosition();
        expect(cameraController.getCurrentState()).toEqual(PLAYER_PERSPECTIVE_POSITION);
      });
    });

    describe('Distance Calculations', () => {
      it('should calculate distance between positions correctly', () => {
        const pos1: CameraPosition = { x: 0, y: 0, z: 0 };
        const pos2: CameraPosition = { x: 3, y: 4, z: 0 };
        
        const distance = cameraController.calculateDistance(pos1, pos2);
        expect(distance).toBe(5); // 3-4-5 triangle
      });

      it('should calculate distance with negative coordinates', () => {
        const pos1: CameraPosition = { x: -1, y: -2, z: -3 };
        const pos2: CameraPosition = { x: 2, y: 4, z: 6 };
        
        const distance = cameraController.calculateDistance(pos1, pos2);
        expect(distance).toBeCloseTo(Math.sqrt(9 + 36 + 81), 10);
      });

      it('should return zero distance for same position', () => {
        const pos: CameraPosition = { x: 5, y: 10, z: 15 };
        const distance = cameraController.calculateDistance(pos, pos);
        expect(distance).toBe(0);
      });

      it('should calculate rotation distance correctly', () => {
        const rot1: CameraRotation = { x: 0, y: 0, z: 0 };
        const rot2: CameraRotation = { x: 1, y: 2, z: 3 };
        
        const distance = cameraController.calculateRotationDistance(rot1, rot2);
        expect(distance).toBe(6); // 1 + 2 + 3
      });

      it('should handle negative rotation values', () => {
        const rot1: CameraRotation = { x: -1, y: -2, z: -3 };
        const rot2: CameraRotation = { x: 1, y: 2, z: 3 };
        
        const distance = cameraController.calculateRotationDistance(rot1, rot2);
        expect(distance).toBe(12); // |1-(-1)| + |2-(-2)| + |3-(-3)|
      });
    });

    describe('Interpolation', () => {
      it('should interpolate position correctly', () => {
        const from: CameraPosition = { x: 0, y: 0, z: 0 };
        const to: CameraPosition = { x: 10, y: 20, z: 30 };
        
        const interpolated = cameraController.interpolatePosition(from, to, 0.5);
        expect(interpolated).toEqual({ x: 5, y: 10, z: 15 });
      });

      it('should interpolate position at factor 0', () => {
        const from: CameraPosition = { x: 0, y: 0, z: 0 };
        const to: CameraPosition = { x: 10, y: 20, z: 30 };
        
        const interpolated = cameraController.interpolatePosition(from, to, 0);
        expect(interpolated).toEqual(from);
      });

      it('should interpolate position at factor 1', () => {
        const from: CameraPosition = { x: 0, y: 0, z: 0 };
        const to: CameraPosition = { x: 10, y: 20, z: 30 };
        
        const interpolated = cameraController.interpolatePosition(from, to, 1);
        expect(interpolated).toEqual(to);
      });

      it('should interpolate rotation correctly', () => {
        const from: CameraRotation = { x: 0, y: 0, z: 0 };
        const to: CameraRotation = { x: 1, y: 2, z: 3 };
        
        const interpolated = cameraController.interpolateRotation(from, to, 0.5);
        expect(interpolated).toEqual({ x: 0.5, y: 1, z: 1.5 });
      });

      it('should interpolate rotation at factor 0', () => {
        const from: CameraRotation = { x: 0, y: 0, z: 0 };
        const to: CameraRotation = { x: 1, y: 2, z: 3 };
        
        const interpolated = cameraController.interpolateRotation(from, to, 0);
        expect(interpolated).toEqual(from);
      });

      it('should interpolate rotation at factor 1', () => {
        const from: CameraRotation = { x: 0, y: 0, z: 0 };
        const to: CameraRotation = { x: 1, y: 2, z: 3 };
        
        const interpolated = cameraController.interpolateRotation(from, to, 1);
        expect(interpolated).toEqual(to);
      });

      it('should handle interpolation with negative values', () => {
        const from: CameraPosition = { x: -10, y: -20, z: -30 };
        const to: CameraPosition = { x: 10, y: 20, z: 30 };
        
        const interpolated = cameraController.interpolatePosition(from, to, 0.5);
        expect(interpolated).toEqual({ x: 0, y: 0, z: 0 });
      });

      it('should handle interpolation with different factor values', () => {
        const from: CameraPosition = { x: 0, y: 0, z: 0 };
        const to: CameraPosition = { x: 100, y: 100, z: 100 };
        
        const interpolated25 = cameraController.interpolatePosition(from, to, 0.25);
        expect(interpolated25).toEqual({ x: 25, y: 25, z: 25 });
        
        const interpolated75 = cameraController.interpolatePosition(from, to, 0.75);
        expect(interpolated75).toEqual({ x: 75, y: 75, z: 75 });
      });
    });

    describe('Edge Cases', () => {
      it('should handle extreme factor values', () => {
        const from: CameraPosition = { x: 0, y: 0, z: 0 };
        const to: CameraPosition = { x: 10, y: 10, z: 10 };
        
        const interpolatedNegative = cameraController.interpolatePosition(from, to, -0.5);
        expect(interpolatedNegative).toEqual({ x: -5, y: -5, z: -5 });
        
        const interpolatedOver = cameraController.interpolatePosition(from, to, 1.5);
        expect(interpolatedOver).toEqual({ x: 15, y: 15, z: 15 });
      });

      it('should handle very small position differences', () => {
        const from: CameraPosition = { x: 0.001, y: 0.001, z: 0.001 };
        const to: CameraPosition = { x: 0.002, y: 0.002, z: 0.002 };
        
        const distance = cameraController.calculateDistance(from, to);
        expect(distance).toBeCloseTo(Math.sqrt(0.000003), 10);
      });

      it('should handle very large position differences', () => {
        const from: CameraPosition = { x: -1000, y: -1000, z: -1000 };
        const to: CameraPosition = { x: 1000, y: 1000, z: 1000 };
        
        const distance = cameraController.calculateDistance(from, to);
        expect(distance).toBeCloseTo(Math.sqrt(12000000), 10);
      });
    });
  });
}); 