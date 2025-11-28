// Controller: recebe pedidos HTTP e delega para a camada de serviços

import {
  getTopMoviesService,
  getTopSeriesService,
  getGlobalRankingService,
  getMediaByCategoryService,
  createCommentService,
  listCommentsService,
  createMediaService,
  listAllMediaService,
  searchMediaByTitleService,
  getMediaByIdService,
  updateMediaService,
  deleteMediaService
} from "../services/media.service.js";


// ==========================
// TOP 10 MOVIES
// ==========================
export async function getTopMovies(req, res, next) {
  try {
    const result = await getTopMoviesService();
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// TOP 10 SERIES
// ==========================
export async function getTopSeries(req, res, next) {
  try {
    const result = await getTopSeriesService();
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// GLOBAL RANKING
// ==========================
export async function getGlobalRanking(req, res, next) {
  try {
    const result = await getGlobalRankingService();
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// FILTRAR POR CATEGORIA
// ==========================
export async function getMediaByCategory(req, res, next) {
  try {
    const { category } = req.query;
    const result = await getMediaByCategoryService(category);
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// CRIAR COMENTÁRIO
// ==========================
export async function createComment(req, res, next) {
  try {
    const result = await createCommentService(req.params.mediaId, req.body, req.user);
    res.status(201).json(result);
  } catch (err) { next(err); }
}


// ==========================
// LISTAR COMENTÁRIOS
// ==========================
export async function listComments(req, res, next) {
  try {
    const result = await listCommentsService(req.params.mediaId);
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// CRIAR MEDIA
// ==========================
export async function createMedia(req, res, next) {
  try {
    const result = await createMediaService(req.body, req.user);
    res.status(201).json(result);
  } catch (err) { next(err); }
}


// ==========================
// LISTAR TODOS MEDIA
// ==========================
export async function listAllMedia(req, res, next) {
  try {
    const result = await listAllMediaService(req.query);
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// PESQUISAR POR TÍTULO
// ==========================
export async function searchMediaByTitle(req, res, next) {
  try {
    const result = await searchMediaByTitleService(req.query);
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// OBTER POR ID
// ==========================
export async function getMediaById(req, res, next) {
  try {
    const result = await getMediaByIdService(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// ATUALIZAR MEDIA
// ==========================
export async function updateMedia(req, res, next) {
  try {
    const result = await updateMediaService(req.params.id, req.body, req.user);
    res.json(result);
  } catch (err) { next(err); }
}


// ==========================
// APAGAR MEDIA
// ==========================
export async function deleteMedia(req, res, next) {
  try {
    const result = await deleteMediaService(req.params.id, req.user);
    res.json(result);
  } catch (err) { next(err); }
}
