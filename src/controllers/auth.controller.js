// Controller: recebe pedidos HTTP e delega para a camada de serviços

import {
  getUserProfileService,
  getAllUsersService,
  getUserMediaService,
  updateUserProfileService,
  updateUserPrivacyService,
  updateUserAvatarService
} from "../services/user.service.js";


// ============================
// VER PERFIL COM PRIVACIDADE
// ============================
export async function getUserProfile(req, res, next) {
  try {
    const { nickName } = req.params;

    const result = await getUserProfileService(nickName, req.user);

    return res.json(result);

  } catch (err) {
    next(err);
  }
}


// ============================
// LISTAR USERS (ADMIN)
// ============================
export async function getAllUsers(req, res, next) {
  try {
    const { page, pageSize } = req.query;

    const result = await getAllUsersService(page, pageSize);

    return res.json(result);

  } catch (err) {
    next(err);
  }
}


// ============================
// VER MEDIA DE UM USER
// ============================
export async function getUserMedia(req, res, next) {
  try {
    const { nickName } = req.params;
    const { page, pageSize } = req.query;

    const result = await getUserMediaService(nickName, page, pageSize);

    return res.json(result);

  } catch (err) {
    next(err);
  }
}


// ============================
// ATUALIZAR PERFIL
// ============================
export async function updateProfile(req, res, next) {
  try {
    const result = await updateUserProfileService(req.user.id, req.body);

    return res.json(result);

  } catch (err) {
    next(err);
  }
}


// ============================
// ATUALIZAR PRIVACIDADE
// ============================
export async function updatePrivacy(req, res, next) {
  try {
    const result = await updateUserPrivacyService(req.user.id, req.body.privacy);

    return res.json(result);

  } catch (err) {
    next(err);
  }
}


// ============================
// ATUALIZAR AVATAR
// ============================
export async function updateAvatar(req, res, next) {
  try {
    const result = await updateUserAvatarService(req.user.id, req.body.avatar);

    return res.json(result);

  } catch (err) {
    next(err);
  }
}
