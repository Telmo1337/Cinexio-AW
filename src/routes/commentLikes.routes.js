import { Router } from "express";
import { verifyToken } from "../utils/auth.js";
import {
  toggleCommentLike,
  getCommentLikes
} from "../controllers/commentLikes.controller.js";

const router = Router();

// Like / unlike
router.post("/:commentId/like", verifyToken, toggleCommentLike);

// Ver quem deu like (opcional)
router.get("/:commentId/likes", verifyToken, getCommentLikes);

export default router;
