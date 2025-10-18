import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Graph from "../components/Graph";
import UserManagement from "../components/UserManagement";
import axios from "axios";

const Home: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // function to add hobby to a user
  const handleAddHobby = async (userId: string, hobby: string) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${userId}/addHobby`, { hobby });
      fetchUsers(); // update users and graph
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar 25% */}
      <div className="w-1/4 p-4 border-r border-gray-800">
        <Sidebar allUsers={users} onAddHobby={handleAddHobby} />
      </div>

      {/* Center Graph 50% */}
      <div className="w-1/2 p-4">
        <Graph allUsers={users} />
      </div>

      {/* Right User Management 25% */}
      <div className="w-1/4 p-4 border-l border-gray-800">
        <UserManagement users={users} refreshUsers={fetchUsers} />
      </div>
    </div>
  );
};

export default Home;
