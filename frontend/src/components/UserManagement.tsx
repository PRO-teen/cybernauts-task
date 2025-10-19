import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUserContext();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState<number>(0);
  const [hobbies, setHobbies] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setUsername("");
    setAge(0);
    setHobbies("");
    setEditId(null);
  };

  const handleSubmit = async () => {
    const hobbyArray = hobbies.split(",").map(h => h.trim()).filter(h => h);
    const userData = { username, age, hobbies: hobbyArray, friends: [], popularityScore: 0 };

    if (editId) {
      await updateUser(editId, userData);
      alert("User updated successfully!");
    } else {
      await addUser(userData);
      alert("User created successfully!");
    }

    resetForm();
  };

  const handleEdit = (user: any) => {
    setUsername(user.username);
    setAge(user.age);
    setHobbies(user.hobbies.join(", "));
    setEditId(user._id);
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      await deleteUser(userId);
      alert("User deleted successfully!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-2 p-2 rounded bg-gray-700 text-white" />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full mb-2 p-2 rounded bg-gray-700 text-white" />
        <input type="text" placeholder="Hobbies (comma separated)" value={hobbies} onChange={(e) => setHobbies(e.target.value)} className="w-full mb-2 p-2 rounded bg-gray-700 text-white" />
        <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 p-2 rounded mt-2">
          {editId ? "Update User" : "Create User"}
        </button>
        {editId && <button onClick={resetForm} className="w-full bg-gray-600 hover:bg-gray-700 p-2 rounded mt-2">Cancel Edit</button>}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {users.map((user) => (
          <div key={user._id} className="bg-gray-700 p-2 rounded flex justify-between items-center cursor-pointer" draggable onDragStart={(e) => e.dataTransfer.setData("dragUserId", user._id)}>
            <span>{user.username}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(user)} className="bg-yellow-500 hover:bg-yellow-600 px-2 rounded">Edit</button>
              <button onClick={() => handleDelete(user._id)} className="bg-red-600 hover:bg-red-700 px-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
