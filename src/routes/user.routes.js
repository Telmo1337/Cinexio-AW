// Rotas relacionadas com utilizadores (perfil, avatar, privacidade e listagens)

import { Router } from "express";

// Middleware de autenticação e permissões
import { verifyToken, requireAdmin } from "../utils/auth.js";

// Controllers responsáveis pela lógica
import {
  getUserProfile,
  getAllUsers,
  getUserMedia,
  updateProfile,
  updatePrivacy,
  updateAvatar
} from "../controllers/user.controller.js";

const router = Router();

// Ver perfil com regras de privacidade

router.get("/:nickName/profile", verifyToken, getUserProfile);

// Listar todos os users (apenas ADMIN)
router.get("/", verifyToken, requireAdmin, getAllUsers);

// Ver media criados por um user
router.get("/:nickName/media", verifyToken, getUserMedia);

// Atualizar o perfil (bio, preferences, language)
router.put("/profile", verifyToken, updateProfile);

// Atualizar privacidade (PUBLIC, FRIENDS, PRIVATE)
router.put("/privacy", verifyToken, updatePrivacy);

// Atualizar avatar
router.put("/avatar", verifyToken, updateAvatar);

export default router;
