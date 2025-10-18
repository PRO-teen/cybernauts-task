// src/components/Graph/CustomNode.tsx
import React from "react";
import { Handle, Position } from "reactflow";

interface CustomNodeProps {
  data: {
    id: string;
    username: string;
    age: number;
    popularityScore: number;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  // Color intensity based on popularityScore (max 255)
  const colorIntensity = Math.min(255, data.popularityScore * 20);
  const bgColor = `rgb(${colorIntensity}, 100, 255)`; // Purple-ish color

  return (
    <div
      className="p-2 rounded-md border border-gray-600 text-white"
      style={{ backgroundColor: bgColor }}
    >
      <div className="font-bold">{data.username}</div>
      <div className="text-sm">Age: {data.age}</div>
      <div className="text-xs">Score: {data.popularityScore}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
