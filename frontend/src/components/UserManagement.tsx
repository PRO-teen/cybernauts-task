import React, { useState } from "react";
import axios from "axios";

interface UserManagementProps {
  users: any[];
  refreshUsers: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, refreshUsers }) => {
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
    if (!username || age <= 0) {
      alert("Please provide valid username and age."); // simple validation
      return;
    }

    const hobbyArray = hobbies.split(",").map((h) => h.trim()).filter((h) => h);

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/users/${editId}`, {
          username,
          age,
          hobbies: hobbyArray,
        });
        alert("User updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/users", {
          username,
          age,
          hobbies: hobbyArray,
        });
        alert("User created successfully!");
      }
      resetForm();
      refreshUsers();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleEdit = (user: any) => {
    setUsername(user.username);
    setAge(user.age);
    setHobbies(user.hobbies.join(", "));
    setEditId(user._id);
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? Please unlink friends first!"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      alert("User deleted successfully!");
      refreshUsers();
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert("Cannot delete user. Unlink friends first.");
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">👤 User Management</h2>

      {/* Form */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Hobbies (comma separated)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded mt-2"
        >
          {editId ? "Update User" : "Create User"}
        </button>
        {editId && (
          <button
            onClick={resetForm}
            className="w-full bg-gray-600 hover:bg-gray-700 p-2 rounded mt-2"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Users List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-700 p-2 rounded flex justify-between items-center cursor-pointer"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("dragUserId", user._id)}
          >
            <span>{user.username}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-500 hover:bg-yellow-600 px-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-600 hover:bg-red-700 px-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
