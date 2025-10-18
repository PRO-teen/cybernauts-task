import React from "react";

interface UserInfoCardProps {
  user: {
    username: string;
    age: number;
    hobbies: string[];
    popularityScore: number;
  } | null;
  onClose: () => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div
      className="
        absolute sm:right-4 sm:top-4 right-2 top-2 
        w-11/12 sm:w-64 
        bg-gray-800 text-white rounded-2xl shadow-lg 
        p-3 sm:p-4 border border-gray-700 
        z-50 
        max-h-[80vh] overflow-y-auto
      "
    >
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg sm:text-xl font-semibold truncate">{user.username}</h2>
        <button
          className="text-gray-400 hover:text-red-400 font-bold text-lg sm:text-xl"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <p className="text-xs sm:text-sm text-gray-300 mb-1">
        <span className="font-medium">Age:</span> {user.age}
      </p>
      <p className="text-xs sm:text-sm text-gray-300 mb-1">
        <span className="font-medium">Popularity:</span> {user.popularityScore}
      </p>

      <div className="mt-2">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-400">Hobbies:</h3>
        <ul className="list-disc list-inside text-xs sm:text-sm text-gray-300 space-y-0.5">
          {user.hobbies.length > 0 ? (
            user.hobbies.map((hobby, i) => <li key={i}>{hobby}</li>)
          ) : (
            <li>No hobbies listed</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserInfoCard;
