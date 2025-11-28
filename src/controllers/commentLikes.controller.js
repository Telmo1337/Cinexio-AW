import {
  toggleCommentLikeService,
  getCommentLikesService
} from "../services/commentLikes.service.js";

import { z } from "zod";
import { validateSchema } from "../utils/validation.js";


// Like / unlike
export async function toggleCommentLike(req, res, next) {
  try {
    const { commentId } = validateSchema(
      z.object({ commentId: z.string().uuid("Invalid comment id") }),
      req.params
    );
    const result = await toggleCommentLikeService(
      commentId,
      req.user.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Ver quem deu like (opcional)
export async function getCommentLikes(req, res, next) {
  try {
    
    const { commentId } = validateSchema(
      z.object({ commentId: z.string().uuid("Invalid comment id") }),
      req.params
    );
    const result = await getCommentLikesService(commentId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
