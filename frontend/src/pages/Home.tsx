import React from "react";
import Sidebar from "../components/Sidebar";
import Graph from "../components/Graph";
import UserManagement from "../components/UserManagement";
import { useUserContext } from "../context/UserContext";

const Home: React.FC = () => {
  const { users, fetchUsers } = useUserContext();

  const handleAddHobby = async (userId: string) => {
    // Example if you want to trigger re-fetch after hobby added
    await fetchUsers();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/4 p-4 border-r border-gray-800">
        <Sidebar allUsers={users} onAddHobby={handleAddHobby} />
      </div>

      <div className="w-1/2 p-4">
        <Graph allUsers={users} />
      </div>

      <div className="w-1/4 p-4 border-l border-gray-800">
        <UserManagement users={users} refreshUsers={fetchUsers} />
      </div>
    </div>
  );
};

export default Home;
