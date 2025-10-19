import { Request, Response } from "express";
import { z, ZodError } from "zod";
import { User } from "../model/User";
import { userSchema } from "../validation/userValidation";
import { calculatePopularityScore } from "../utils/helpers";
import { normalizeHobbies } from "../utils/helpers";



// GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.parse(req.body);

    // Normalize hobbies
    if (parsed.hobbies) {
      parsed.hobbies = normalizeHobbies(parsed.hobbies);
    }

    const newUser = new User(parsed);
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      // TS now knows `errors` exists
      console.error("Validation failed:", error.errors);

      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.partial().parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, parsed, { new: true });

    // ✅ Update popularity score if hobbies changed
    if (user) await calculatePopularityScore(user);

    res.status(200).json(user);
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//delete
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Prevent deletion if user still has friends
    if (user.friends.length > 0) {
      return res
        .status(409)
        .json({ message: "Cannot delete user with active friendships" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
