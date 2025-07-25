import Tree from "@/components/Tree";

const trees = [
  {
    id: "tree-left-1",
    position: [2, 0, -3.5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 2 as const,
  },
  {
    id: "tree-left-2",
    position: [0.8, 0, -3.5] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 2 as const,
  },
  {
    id: "tree-left-3",
    position: [-2, 0.3, -3.5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 1 as const,
  },

  {
    id: "tree-bottom-1",
    position: [-3.3, 0, -1.2] as [number, number, number],
    rotation: [0, -Math.PI, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 3 as const,
  },

  {
    id: "tree-right-1",
    position: [-3.5, 0.2, 2.8] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 3 as const,
  },
  {
    id: "tree-right-2",
    position: [-2, 0, 3] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 2 as const,
  },
  {
    id: "tree-right-3",
    position: [2.5, 0.2, 3.1] as [number, number, number],
    rotation: [0, -Math.PI / 2.5, 0] as [number, number, number],
    scale: [0.8, 0.8, 0.8] as [number, number, number],
    variant: 3 as const,
  },
];

const TreePlane = () => {
  return (
    <group rotation={[Math.PI / 2, Math.PI / 2, 0]} position={[0, 0, 0.1]}>
      {trees.map((tree) => (
        <Tree
          key={tree.id}
          position={tree.position}
          rotation={tree.rotation}
          scale={tree.scale}
          variant={tree.variant}
        />
      ))}
    </group>
  );
};

export default TreePlane;
