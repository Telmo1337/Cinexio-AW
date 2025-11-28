// Controller da biblioteca: trata request/response e chama a camada de serviços

import {
  getPublicLibraryService,
  getLibraryStatsService,
  getFavoritesService,
  getWatchedService,
  getUserLibraryService,
  updateLibraryEntryService,
  addToLibraryService,
  removeFromLibraryService
} from "../services/library.service.js";


// Biblioteca pública de outro user
export async function getPublicLibrary(req, res, next) {
  try {
    const result = await getPublicLibraryService(req.params.nickName);
    res.json(result);
  } catch (err) { next(err); }
}


// Estatísticas da biblioteca
export async function getLibraryStats(req, res, next) {
  try {
    const result = await getLibraryStatsService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Favoritos
export async function getFavorites(req, res, next) {
  try {
    const result = await getFavoritesService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Vistos
export async function getWatched(req, res, next) {
  try {
    const result = await getWatchedService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Biblioteca completa
export async function getUserLibrary(req, res, next) {
  try {
    const result = await getUserLibraryService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Atualizar entrada
export async function updateLibraryEntry(req, res, next) {
  try {
    const result = await updateLibraryEntryService(
      req.user.id,
      req.params.mediaId,
      req.body
    );
    res.json(result);
  } catch (err) { next(err); }
}


// Adicionar media à biblioteca
export async function addToLibrary(req, res, next) {
  try {
    const result = await addToLibraryService(req.user.id, req.params.mediaId);
    res.status(201).json(result);
  } catch (err) { next(err); }
}


// Remover media da biblioteca
export async function removeFromLibrary(req, res, next) {
  try {
    const result = await removeFromLibraryService(req.user.id, req.params.mediaId);
    res.json(result);
  } catch (err) { next(err); }
}
