import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls,Handle, Position } from "reactflow";
import type  { Node,Edge } from "reactflow";
import "reactflow/dist/style.css";
import UserInfoCard from "./UserInfoCard";
import { useUserContext } from "../context/UserContext";

interface GraphProps {
  allUsers: any[];
}

const Graph: React.FC<GraphProps> = ({ allUsers }) => {
  const { fetchUsers, linkUsers, unlinkUsers, updateUser } = useUserContext();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const maxPopularity = Math.max(...allUsers.map((u) => u.popularityScore), 1);

  // Build Graph Nodes and Edges
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
              <Handle type="source" position={Position.Right} id="source" style={{ background: "#555" }} />
              <Handle type="target" position={Position.Left} id="target" style={{ background: "#555" }} />
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

  // Handle Hobby Drop
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const hobby = event.dataTransfer.getData("hobby");
    if (!hobby) return;

    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const nodeElement = elements.find(el => el.classList.contains("react-flow__node"));
    if (!nodeElement) return;

    const nodeId = nodeElement.getAttribute("data-id");
    if (!nodeId) return;

    const droppedUser = allUsers.find(u => u._id === nodeId);
    if (!droppedUser) return;

    if (droppedUser.hobbies.includes(hobby)) {
      alert(`${droppedUser.username} already has "${hobby}" hobby.`);
      return;
    }

    const updatedHobbies = [...droppedUser.hobbies, hobby];

    try {
      await updateUser(droppedUser._id, { hobbies: updatedHobbies });
      alert(`Added "${hobby}" to ${droppedUser.username}`);
      await fetchUsers(); // refresh context data
    } catch (err) {
      console.error("Error adding hobby:", err);
      alert("Failed to add hobby");
    }
  };

  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

  // Handle Connect (Friendship)
  const handleConnect = async (params: any) => {
    const { source, target } = params;
    if (!source || !target) return;

    try {
      await linkUsers(source, target);
      alert("Users linked successfully!");
    } catch (err: any) {
      if (err.response?.status === 409) alert("Users are already linked!");
      else alert("Failed to create friendship.");
    }
  };

  // Handle Unlink (Edge Click)
  const handleEdgeClick = async (_event: any, edge: any) => {
    const { source, target } = edge;
    const confirmUnlink = window.confirm("Do you want to unlink these users?");
    if (!confirmUnlink) return;

    try {
      await unlinkUsers(source, target);
      alert("Unlinked successfully!");
    } catch (err) {
      console.error("Failed to unlink:", err);
      alert("Failed to unlink friendship.");
    }
  };

  return (
    <div
      className="w-full h-full bg-gray-900 relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => setSelectedUser(node.data.user)}
        onConnect={handleConnect}
        onEdgeClick={handleEdgeClick}
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
