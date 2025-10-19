import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  popularityScore: number;
}

interface UserContextType {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (userData: Omit<User, "_id">) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  linkUsers: (sourceId: string, targetId: string) => Promise<void>;
  unlinkUsers: (sourceId: string, targetId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const API_BASE = import.meta.env.VITE_BACKEND_URI;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const addUser = async (userData: Omit<User, "_id">) => {
    await axios.post(`${API_BASE}/users`, userData);
    await fetchUsers();
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    await axios.put(`${API_BASE}/users/${id}`, userData);
    await fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await axios.delete(`${API_BASE}/users/${id}`);
    await fetchUsers();
  };

  const linkUsers = async (sourceId: string, targetId: string) => {
    await axios.post(`${API_BASE}/users/${sourceId}/link`, { friendId: targetId });
    await fetchUsers();
  };

  const unlinkUsers = async (sourceId: string, targetId: string) => {
    await axios.delete(`${API_BASE}/users/${sourceId}/unlink`, { data: { friendId: targetId } });
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, fetchUsers, addUser, updateUser, deleteUser, linkUsers, unlinkUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used inside UserProvider");
  return context;
};
