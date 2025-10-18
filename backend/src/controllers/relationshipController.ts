import { Request, Response } from "express";
import { User } from "../model/User";
import { calculatePopularityScore } from "../utils/helpers";

// POST /api/users/:id/link
export const linkUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    if (id === friendId) return res.status(400).json({ message: "Cannot friend yourself" });

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User not found" });

    if (user.friends.includes(friendId)) {
      return res.status(409).json({ message: "Already friends" });
    }

    user.friends.push(friendId);
    friend.friends.push(id);

    await user.save();
    await friend.save();

    await calculatePopularityScore(user);
    await calculatePopularityScore(friend);

    res.status(200).json({ message: "Friendship created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/:id/unlink
export const unlinkUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User not found" });

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Users are not friends" });
    }

    user.friends = user.friends.filter(fid => fid.toString() !== friendId);
    friend.friends = friend.friends.filter(fid => fid.toString() !== id);

    await user.save();
    await friend.save();

    await calculatePopularityScore(user);
    await calculatePopularityScore(friend);

    res.status(200).json({ message: "Friendship removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/graph
export const getGraph = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("username age hobbies friends popularityScore");
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
