import { useEffect, useState } from "react";

import { Droplet } from "@/components/Droplet";
import SplashRing from "@/components/SplashRing";

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
    const timestamp = Date.now();
    setRings([timestamp]);
    const dirs = Array.from({ length: 10 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      return {
        id: i,
        dir: [Math.cos(angle), Math.sin(angle)] as [number, number],
      };
    });
    setDrops(dirs);
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
