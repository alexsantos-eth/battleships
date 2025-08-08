import type * as THREE from "three";
import type { ReactThreeFiber } from "@react-three/fiber";

type BoatProjMatImpl = InstanceType<typeof BoatProjMat>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      boatProjMat: ReactThreeFiber.MaterialNode<
        BoatProjMatImpl,
        typeof BoatProjMat
      > & {
        color?: THREE.ColorRepresentation;
        opacity?: number;
        softness?: number;
        rotation?: number;
        aspect?: number;
        transparent?: boolean;
        depthWrite?: boolean;
        blending?: THREE.Blending;
        toneMapped?: boolean;
      };
    }
  }
}
