import Rock from "../Rock";

const rocks = [
  {
    id: "rock-left-1",
    variant: 6 as const,
    position: [-3.5, 0, 0.1] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 4, 0] as [number, number, number],
  },
  {
    id: "rock-left-2",
    variant: 2 as const,
    position: [-3, -0.8, 0.2] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 4, 0] as [number, number, number],
  },
  {
    id: "rock-left-3",
    variant: 2 as const,
    position: [-3, -1.4, -0.1] as [number, number, number],
    rotation: [Math.PI / 2, -Math.PI / 2, 1] as [number, number, number],
  },

  {
    id: "rock-left-4",
    variant: 7 as const,
    position: [-2.7, -2.6, 0.5] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 4, 2] as [number, number, number],
  },
  {
    id: "rock-bottom-1",
    variant: 6 as const,
    position: [-1.7, -3, -0.55] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 3, 0] as [number, number, number],
  },
  {
    id: "rock-bottom-2",
    variant: 7 as const,
    position: [1.1, -3.3, -0.25] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },


  {
    id: "rock-bottom-3",
    variant: 4 as const,
    position: [2, -3.1, 0] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },

 
  {
    id: "rock-right-1",
    variant: 7 as const,
    position: [3.5, -1, 0] as [number, number, number],
    rotation: [Math.PI / 2, Math.PI / 2, 0] as [number, number, number],
  },
  {
    id: "rock-right-2",
    variant: 4 as const,
    position: [3.5, 0.5, 0.2] as [number, number, number],
    rotation: [Math.PI / 2, -Math.PI / 2, 0] as [number, number, number],
  },
  {
    id: "rock-right-3",
    variant: 3 as const,
    position: [3.2, 1, -0.1] as [number, number, number],
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
