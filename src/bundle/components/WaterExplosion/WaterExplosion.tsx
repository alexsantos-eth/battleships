import React, { useEffect, useState } from "react";

import { Droplet } from "@/bundle/components/Droplet";
import { SplashRing } from "@/bundle/primitives";

import { generateExplosionPattern } from "./tools/calculations";

import type { WaterExplosionProps, DropConfig } from "./WaterExplosion.types";
export const WaterExplosion: React.FC<WaterExplosionProps> = ({
  position,
  onDone,
}) => {
  const [rings, setRings] = useState<number[]>([]);
  const [drops, setDrops] = useState<DropConfig[]>([]);

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
