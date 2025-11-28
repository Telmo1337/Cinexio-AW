// Rotas responsáveis pela gestão de listas personalizadas

import { Router } from "express";
import { verifyToken } from "../utils/auth.js";

import {
  createList,
  getMyLists,
  getListById,
  deleteList,
  changeListPrivacy,
  addMediaToList,
  removeMediaFromList
} from "../controllers/list.controller.js";

const router = Router();

// Criar lista
router.post("/", verifyToken, createList);

// Listas do utilizador autenticado
router.get("/my", verifyToken, getMyLists);

// Ver uma lista (respeitando privacidade)
router.get("/:listId", verifyToken, getListById);

// Apagar lista
router.delete("/:listId", verifyToken, deleteList);

// Alterar privacidade
router.patch("/:listId/privacy", verifyToken, changeListPrivacy);

// Adicionar media à lista
router.post("/:listId/items/:mediaId", verifyToken, addMediaToList);

// Remover media da lista
router.delete("/:listId/items/:mediaId", verifyToken, removeMediaFromList);

export default router;
