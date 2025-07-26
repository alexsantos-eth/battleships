import { useEffect, useState } from "react";

import { Droplet } from "@/components/Droplet";
import SplashRing from "@/components/SplashRing";
import { generateExplosionPattern } from "./calculations";

interface WaterExplosionProps {
  position: [number, number];
  onDone?: () => void;
}

const WaterExplosion: React.FC<WaterExplosionProps> = ({
  position,
  onDone,
}) => {
  const [rings, setRings] = useState<number[]>([]);
  const [drops, setDrops] = useState<{ id: number; dir: [number, number] }[]>(
    []
  );

  useEffect(() => {
    const pattern = generateExplosionPattern();
    setRings(pattern.rings);
    setDrops(pattern.drops);
  }, [position]);

  return (
    <>
      {rings.map((id) => (
        <SplashRing
          key={id}
          position={position}
          onDone={() => {
            setRings((prev) => prev.filter((x) => x !== id));
            onDone?.();
          }}
        />
      ))}

      {drops.map(({ id, dir }) => (
        <Droplet
          key={id}
          position={position}
          dir={dir}
          onDone={() => {
            setDrops((prev) => prev.filter((d) => d.id !== id));
            onDone?.();
          }}
        />
      ))}
    </>
  );
};

export default WaterExplosion;
