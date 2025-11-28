// Rotas responsáveis pela gestão de comentários

import { Router } from "express";
import { verifyToken } from "../utils/auth.js";

// Controllers
import {
  getCommentsByUser,
  updateComment,
  deleteComment
} from "../controllers/comments.controller.js";

const router = Router();

// Ver todos os comentários feitos por um utilizador
router.get("/user/:nickName", getCommentsByUser);

// Editar comentário (autenticado)
router.put("/:commentId", verifyToken, updateComment);

// Apagar comentário (autor ou admin)
router.delete("/:commentId", verifyToken, deleteComment);

export default router;
