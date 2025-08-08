import type { ShipProps } from "@/bundle/primitives";
import type { SHIP_VARIANT } from "@/bundle/primitives/Ship/constants/variants";

interface WaterProjection {
  projectionRadius: number;
  orientation: ShipProps["orientation"];
  shipConfig: SHIP_VARIANT;
  color: string;
}

const WaterProjection: React.FC<WaterProjection> = ({
  projectionRadius,
  orientation,
  shipConfig,
  color = "#fff",
}) => {
  return (
    <mesh
      position={[0, 0, -0.9 * projectionRadius]}
      frustumCulled={false}
      rotation={[0, 0, orientation === "horizontal" ? Math.PI / 2 : 0]}
    >
      <capsuleGeometry
        args={[
          projectionRadius,
          0.35 * shipConfig.size + shipConfig.projectionOffset.y,
          2,
          10,
        ]}
      />

      <meshBasicMaterial transparent color={color} opacity={0.8} />
    </mesh>
  );
};

export default WaterProjection;
