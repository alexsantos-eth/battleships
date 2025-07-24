import Rock from "../Rock";

const rocks = [
  {
    id: "rock-left-1",
    variant: 6 as const,
    position: [-3.5, 0, 0.2] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 4, 0] as [number, number, number],
  },
  {
    id: "rock-left-2",
    variant: 1 as const,
    position: [-3, -0.8, 0.2] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 4, 0] as [number, number, number],
  },
  {
    id: "rock-left-3",
    variant: 2 as const,
    position: [-3.2, -1.4, 0] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 4, 0] as [number, number, number],
  },
  {
    id: "rock-left-4",
    variant: 7 as const,
    position: [-3.2, -3.2, 0.1] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 4, 0] as [number, number, number],
  },
  {
    id: "rock-left-5",
    variant: 8 as const,
    position: [3.2, -1, -0.7] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 4, 0] as [number, number, number],
  },

  {
    id: "rock-left-6",
    variant: 9 as const,
    position: [3.5, 0.05, -0.4] as [number, number, number],
    rotation: [Math.PI / 2, -Math.PI / 2, 0] as [number, number, number],
  },
];

const RocksPlane = () => {
  return (
    <group>
      {rocks.map((rock) => (
        <Rock
          key={rock.id}
          variant={rock.variant}
          position={rock.position}
          rotation={rock.rotation}
        />
      ))}
    </group>
  );
};

export default RocksPlane;
