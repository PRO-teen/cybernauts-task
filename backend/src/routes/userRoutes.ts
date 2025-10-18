import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// POST new user
router.post("/", createUser);

// PUT update user by id
router.put("/:id", updateUser);

// DELETE user by id
router.delete("/:id", deleteUser);

export default router;
