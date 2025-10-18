import express from "express";
import { linkUsers, unlinkUsers, getGraph } from "../controllers/relationshipController";

const router = express.Router();

router.post("/:id/link", linkUsers);
router.delete("/:id/unlink", unlinkUsers);
router.get("/graph", getGraph); // returns all users + friends

export default router;
