// Rotas relacionadas com a biblioteca do utilizador

import { Router } from "express";
import { verifyToken } from "../utils/auth.js";

import {
  getPublicLibrary,
  getLibraryStats,
  getFavorites,
  getWatched,
  getUserLibrary,
  updateLibraryEntry,
  addToLibrary,
  removeFromLibrary
} from "../controllers/library.controller.js";

const router = Router();

// Biblioteca pública de outro utilizador
router.get("/user/:nickName", verifyToken, getPublicLibrary);

// Estatísticas da biblioteca do utilizador
router.get("/stats", verifyToken, getLibraryStats);

// Favoritos
router.get("/favorites", verifyToken, getFavorites);

// Vistos
router.get("/watched", verifyToken, getWatched);

// Biblioteca completa do utilizador logado
router.get("/", verifyToken, getUserLibrary);

// Atualizar estado (favorite, watched, rating, notes…)
router.put("/:mediaId", verifyToken, updateLibraryEntry);

// Adicionar media à biblioteca
router.post("/:mediaId", verifyToken, addToLibrary);

// Remover media da biblioteca
router.delete("/:mediaId", verifyToken, removeFromLibrary);

export default router;
