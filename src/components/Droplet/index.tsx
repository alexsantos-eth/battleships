import { useRef } from "react";
import { Mesh } from "three";

import { a, useSpring } from "@react-spring/three";
import { COLORS } from "@/config/colors";

interface DropletProps {
  position: [number, number];
  dir: [number, number];
  onDone: () => void;
}

export const Droplet: React.FC<DropletProps> = ({ position, dir, onDone }) => {
  const mesh = useRef<Mesh>(null!);

  const { pos, opacity } = useSpring({
    from: {
      pos: [position[0], position[1], 0.15] as [number, number, number],
      opacity: 1,
    },
    to: {
      pos: [position[0] + dir[0] * 0.5, position[1] + dir[1] * 0.5, 0.5] as [
        number,
        number,
        number
      ],
      opacity: 0,
    },
    config: { duration: 400 },
    onRest: onDone,
  });

  return (
    <a.mesh ref={mesh} position={pos}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <a.meshStandardMaterial color={COLORS.water.droplet} transparent opacity={opacity} />
    </a.mesh>
  );
};
