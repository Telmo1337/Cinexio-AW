// Rotas responsáveis pela gestão de filmes e séries (media)

import { Router } from "express";
import { verifyToken } from "../utils/auth.js";

// Controllers
import {
  getTopMovies,
  getTopSeries,
  getGlobalRanking,
  getMediaByCategory,
  createComment,
  listComments,
  createMedia,
  listAllMedia,
  searchMediaByTitle,
  getMediaById,
  updateMedia,
  deleteMedia
} from "../controllers/media.controller.js";

const router = Router();


// Top 10 filmes
router.get("/top/global/movies", verifyToken, getTopMovies);

// Top 10 séries
router.get("/top/global/series", verifyToken, getTopSeries);

// Ranking geral
router.get("/ranking", verifyToken, getGlobalRanking);

// Filtrar por categoria
router.get("/bycategory", verifyToken, getMediaByCategory);

// Criar comentário num media
router.post("/:mediaId/comments", verifyToken, createComment);

// Listar comentários
router.get("/:mediaId/comments", listComments);

// Criar media
router.post("/", verifyToken, createMedia);

// Listar todos media com paginação e ordenação
router.get("/", verifyToken, listAllMedia);

// Pesquisar por título
router.get("/search", verifyToken, searchMediaByTitle);

// Obter media por ID
router.get("/:id", verifyToken, getMediaById);

// Atualizar media
router.put("/:id", verifyToken, updateMedia);

// Apagar media
router.delete("/:id", verifyToken, deleteMedia);


export default router;
