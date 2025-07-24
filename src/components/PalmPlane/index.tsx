import PalmTree from "../PalmTree";

const palmTrees = [
  {
    id: "palm-top-left",
    position: [-1, 0, -3.5] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 1 as const,
  },
  {
    id: "palm-top-right",
    position: [2, 0, -3.5] as [number, number, number],
    rotation: [0, -Math.PI / 4, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 2 as const,
  },
  {
    id: "palm-bottom-left",
    position: [-2.5, 0.6, -3.5] as [number, number, number],
    rotation: [0, -Math.PI / 4, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 3 as const,
  },
  {
    id: "palm-bottom-right",
    position: [2.5, 0.2, 3.5] as [number, number, number],
    rotation: [0, -Math.PI / 4, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 3 as const,
  },
  {
    id: "palm-center-left",
    position: [-1.7, 0.2, 4.1] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 2 as const,
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
