import { useRef } from "react";
import { Mesh } from "three";

import { COLORS } from "@/config/colors";
import { a, useSpring } from "@react-spring/three";
import {
  calculateDropletAnimation,
  DROPLET_ANIMATION_DURATION,
} from "./calculations";

interface DropletProps {
  position: [number, number];
  dir: [number, number];
  onDone: () => void;
}

export const Droplet: React.FC<DropletProps> = ({ position, dir, onDone }) => {
  const mesh = useRef<Mesh>(null!);

  const animation = calculateDropletAnimation(position, dir);
  const { pos, opacity } = useSpring({
    from: {
      pos: [animation.from.x, animation.from.y, animation.from.z] as [number, number, number],
      opacity: animation.opacity.from,
    },
    to: {
      pos: [animation.to.x, animation.to.y, animation.to.z] as [number, number, number],
      opacity: animation.opacity.to,
    },
    config: { duration: DROPLET_ANIMATION_DURATION },
    onRest: onDone,
  });

  return (
    <a.mesh ref={mesh} position={pos}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <a.meshStandardMaterial
        color={COLORS.water.droplet}
        transparent
        opacity={opacity}
      />
    </a.mesh>
  );
};
