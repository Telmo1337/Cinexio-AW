import {
  toggleCommentLikeService,
  getCommentLikesService
} from "../services/commentLikes.service.js";

export async function toggleCommentLike(req, res, next) {
  try {
    const result = await toggleCommentLikeService(
      req.params.commentId,
      req.user.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCommentLikes(req, res, next) {
  try {
    const result = await getCommentLikesService(req.params.commentId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
