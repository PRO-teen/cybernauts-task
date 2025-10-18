import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls,Handle, Position } from "reactflow";
import type  { Node,Edge } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import UserInfoCard from "./UserInfoCard";

interface GraphProps {
  allUsers: any[];
}

const Graph: React.FC<GraphProps> = ({ allUsers }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const maxPopularity = Math.max(...allUsers.map((u) => u.popularityScore), 1);

  // ---------------- Graph Nodes & Edges ----------------
  useEffect(() => {
    const newNodes: Node[] = allUsers.map((user, index) => {
      const intensity = user.popularityScore / maxPopularity;
      const size = 80 + intensity * 40;
      const color = `rgba(${50 + intensity * 200}, ${50}, ${200 - intensity * 100}, 1)`;

      return {
        id: user._id,
        data: {
          label: (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div>{user.username} ({user.age})</div>
              {/* ReactFlow Handles for Friendship */}
              <Handle
                type="source"
                position={Position.Right}
                id="source"
                style={{ background: "#555" }}
              />
              <Handle
                type="target"
                position={Position.Left}
                id="target"
                style={{ background: "#555" }}
              />
            </div>
          ),
          user,
        },
        position: { x: 200 * (index % 3), y: 150 * Math.floor(index / 3) },
        style: {
          width: size,
          height: size,
          background: color,
          borderRadius: 12,
          textAlign: "center",
          cursor: "pointer",
          color: "white",
          padding: 10,
          fontWeight: "600",
        },
      };
    });

    const newEdges: Edge[] = [];
    allUsers.forEach((user) => {
      user.friends.forEach((friendId: string) => {
        if (user._id < friendId) {
          newEdges.push({
            id: `${user._id}-${friendId}`,
            source: user._id,
            target: friendId,
            animated: true,
            style: { stroke: "#888" },
          });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [allUsers]);

  // ---------------- Container Drop for Sidebar Hobby ----------------
  // ---------------- Container Drop for Sidebar Hobby ----------------
const handleDrop = async (event: React.DragEvent) => {
  event.preventDefault();
  const hobby = event.dataTransfer.getData("hobby");
  if (!hobby) return;

  const bounds = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  // find the node (user) the hobby was dropped on
  const elements = document.elementsFromPoint(event.clientX, event.clientY);
  const nodeElement = elements.find(el => el.classList.contains("react-flow__node"));
  if (!nodeElement) return;

  const nodeId = nodeElement.getAttribute("data-id");
  if (!nodeId) return;

  try {
    // fetch the user first (optional, but ensures latest hobbies)
    const { data: user } = await axios.get(`http://localhost:5000/api/users`);
    const selectedUser = user.find((u: any) => u._id === nodeId);
    if (!selectedUser) return;

    // if the hobby already exists, prevent duplicates
    if (selectedUser.hobbies.includes(hobby)) {
      alert(`${selectedUser.username} already has "${hobby}" hobby.`);
      return;
    }

    // update the user’s hobbies
    const updatedHobbies = [...selectedUser.hobbies, hobby];
    await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, {
      ...selectedUser,
      hobbies: updatedHobbies,
    });

    alert(`Added "${hobby}" to ${selectedUser.username}`);
    window.location.reload(); // refresh to update graph colors/scores
  } catch (err) {
    console.error("Error adding hobby:", err);
    alert("Failed to add hobby");
  }
};


  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

  return (
    <div className="w-full h-full bg-gray-900 relative" onDrop={handleDrop} onDragOver={handleDragOver}>
      <ReactFlow
  nodes={nodes}
  edges={edges}
  onNodeClick={(_, node) => setSelectedUser(node.data.user)}
  onConnect={async (params: any) => {
    const { source, target } = params;
    if (!source || !target) return;

    try {
      await axios.post(
        `http://localhost:5000/api/users/${source}/link`,
        { friendId: target },
        { headers: { "Content-Type": "application/json" } }
      );
      window.location.reload();
    } catch (err: any) {
      if (err.response?.status === 409) alert("Users are already linked!");
      else alert("Failed to create friendship.");
    }
  }}

  onEdgeClick={async (event, edge) => {
  if (!edge) {
    console.warn("Edge is undefined");
    return;
  }
  const { source, target } = edge;
  console.log("Clicked edge:", source, target);

  if (!source || !target) return;

  const confirmUnlink = window.confirm("Do you want to unlink these users?");
  if (!confirmUnlink) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/users/${source}/unlink`,
      {
        data: { friendId: target },
        headers: { "Content-Type": "application/json" },
      }
    );
    alert("Unlinked successfully!");
    window.location.reload();
  } catch (err) {
    console.error("Failed to unlink:", err.response || err);
    alert("Failed to unlink friendship.");
  }
}}

  fitView
>

        <Background color="#444" gap={16} />
        <Controls showZoom={false} />
      </ReactFlow>

      <UserInfoCard user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default Graph;
