import React from "react";

import { Tree } from "@/bundle/primitives";

import type { TreePlaneProps, TreeConfig } from "./TreePlane.types";
const trees: TreeConfig[] = [
  {
    id: "tree-left-1",
    position: [2, 0, -3.5],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.8, 0.8, 0.8],
    variant: 2,
  },
  {
    id: "tree-left-2",
    position: [0.8, 0, -3.5],
    rotation: [0, Math.PI, 0],
    scale: [0.8, 0.8, 0.8],
    variant: 2,
  },
  {
    id: "tree-left-3",
    position: [-2, 0.3, -3.5],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.8, 0.8, 0.8],
    variant: 1,
  },
  {
    id: "tree-right-2",
    position: [-2, 0, 3],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.8, 0.8, 0.8],
    variant: 2,
  },
  {
    id: "tree-right-3",
    position: [2.5, 0.2, 3.1],
    rotation: [0, -Math.PI / 2.5, 0],
    scale: [0.8, 0.8, 0.8],
    variant: 3,
  },
];

export const TreePlane: React.FC<TreePlaneProps> = () => {
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
