// Controller das listas: recebe pedido HTTP e delega para os serviços

import {
  createListService,
  getMyListsService,
  getListByIdService,
  deleteListService,
  changeListPrivacyService,
  addMediaToListService,
  removeMediaFromListService
} from "../services/list.service.js";


// Criar lista
export async function createList(req, res, next) {
  try {
    const result = await createListService(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
}


// Listas do utilizador autenticado
export async function getMyLists(req, res, next) {
  try {
    const result = await getMyListsService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Ver lista por ID respeitando privacidade
export async function getListById(req, res, next) {
  try {
    const result = await getListByIdService(req.params.listId, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Apagar lista
export async function deleteList(req, res, next) {
  try {
    const result = await deleteListService(req.params.listId, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Alterar privacidade da lista
export async function changeListPrivacy(req, res, next) {
  try {
    const result = await changeListPrivacyService(req.params.listId, req.user.id, req.body);
    res.json(result);
  } catch (err) { next(err); }
}


// Adicionar media à lista
export async function addMediaToList(req, res, next) {
  try {
    const result = await addMediaToListService(req.params.listId, req.params.mediaId, req.user.id);
    res.status(201).json(result);
  } catch (err) { next(err); }
}


// Remover media da lista
export async function removeMediaFromList(req, res, next) {
  try {
    const result = await removeMediaFromListService(req.params.listId, req.params.mediaId, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}
