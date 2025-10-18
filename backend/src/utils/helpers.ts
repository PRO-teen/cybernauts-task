import { User, IUser } from "../model/User";

// Normalize hobbies
export const normalizeHobbies = (hobbies: string[]): string[] => {
  return hobbies.map((hobby) => hobby.trim().toLowerCase());
};

// Canonical relationship pair
export const createCanonicalPair = (a: string, b: string): string => {
  return [a, b].sort().join("-");
};

// Calculate popularityScore
export const calculatePopularityScore = async (user: IUser) => {
  let sharedHobbiesCount = 0;

  for (const friendId of user.friends) {
    const friend = await User.findById(friendId);
    if (friend) {
      const shared = user.hobbies.filter((h) => friend.hobbies.includes(h));
      sharedHobbiesCount += shared.length;
    }
  }

  const score = user.friends.length + sharedHobbiesCount * 0.5;
  user.popularityScore = score;
  await user.save();
};
