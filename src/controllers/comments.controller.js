// Controller: recebe o pedido HTTP e chama os serviços

import {
  getCommentsByUserService,
  updateCommentService,
  deleteCommentService
} from "../services/comments.service.js";

// ===============================
// LISTAR COMENTÁRIOS DE UM USER
// ===============================
export async function getCommentsByUser(req, res, next) {
  try {
    const { nickName } = req.params;

    const result = await getCommentsByUserService(nickName);

    res.json(result);

  } catch (err) {
    next(err);
  }
}

// ===============================
// EDITAR COMENTÁRIO
// ===============================
export async function updateComment(req, res, next) {
  try {
    const { commentId } = req.params;

    const result = await updateCommentService(commentId, req.body, req.user);

    res.json(result);

  } catch (err) {
    next(err);
  }
}

// ===============================
// APAGAR COMENTÁRIO
// ===============================
export async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;

    const result = await deleteCommentService(commentId, req.user);

    res.json(result);

  } catch (err) {
    next(err);
  }
}
