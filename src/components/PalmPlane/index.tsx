import PalmTree from "../PalmTree";

const palmTrees = [
  {
    id: "palm-left-1",
    position: [2, 0, -3.5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 2 as const,
  },
  {
    id: "palm-left-2",
    position: [0.8, 0, -3.5] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 2 as const,
  },
  {
    id: "palm-left-3",
    position: [-2, 0.3, -3.5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 1 as const,
  },

  {
    id: "palm-bottom-1",
    position: [-3.3, 0, -1.2] as [number, number, number],
    rotation: [0, -Math.PI, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 3 as const,
  },

  {
    id: "palm-right-1",
    position: [-3.5, 0.2, 2.8] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 3 as const,
  },
  {
    id: "palm-right-2",
    position: [-2, 0, 3] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 2 as const,
  },
  {
    id: "palm-right-3",
    position: [2.5, 0.2, 3.1] as [number, number, number],
    rotation: [0, -Math.PI / 2.5, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 3 as const,
  },
];

const PalmPlane = () => {
  return (
    <group rotation={[Math.PI / 2, Math.PI / 2, 0]} position={[0, 0, 0.1]}>
      {palmTrees.map((palmTree) => (
        <PalmTree
          key={palmTree.id}
          position={palmTree.position}
          rotation={palmTree.rotation}
          scale={palmTree.scale}
          variant={palmTree.variant}
        />
      ))}
    </group>
  );
};

export default PalmPlane;
