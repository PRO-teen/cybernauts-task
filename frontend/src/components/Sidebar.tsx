import React, { useState, useEffect } from "react";

interface SidebarProps {
  allUsers: any[]; // list of users from Graph (for potential future use)
  onAddHobby: (userId: string, hobby: string) => void; // called when dropped on node
}

const Sidebar: React.FC<SidebarProps> = ({ allUsers, onAddHobby }) => {
  const [hobbies, setHobbies] = useState<string[]>([
    "reading",
    "music",
    "coding",
    "sports",
    "traveling",
    "gaming",
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // filter hobbies based on search term
  const filteredHobbies = hobbies.filter((h) =>
    h.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, hobby: string) => {
    e.dataTransfer.setData("hobby", hobby); // send hobby name on drag
  };

  return (
   <div className="bg-gray-800 text-white p-4 flex flex-col w-full sm:w-64 h-auto sm:h-full">
  <input
    type="text"
    placeholder="Search hobbies..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="p-2 mb-3 w-full rounded bg-gray-700 focus:outline-none text-sm"
  />
  <ul className="flex-1 overflow-y-auto grid grid-cols-2 sm:block gap-2 sm:space-y-2">
    {filteredHobbies.map((hobby) => (
      <li
        key={hobby}
        className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg cursor-grab text-center text-sm"
        draggable
        onDragStart={(e) => handleDragStart(e, hobby)}
      >
        {hobby}
      </li>
    ))}
  </ul>
</div>

  );
};

export default Sidebar;
