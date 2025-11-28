import { prisma } from "../db/prisma.js";

export async function toggleCommentLikeService(commentId, userId) {
  // Verificar se comment existe
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");

  // Verificar se já existe like
  const existing = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: { userId, commentId }
    }
  });

  if (existing) {
    // remover like
    await prisma.commentLike.delete({
      where: { userId_commentId: { userId, commentId } }
    });

    return { liked: false, message: "Like removed" };
  }

  // criar like
  await prisma.commentLike.create({
    data: { userId, commentId }
  });

  return { liked: true, message: "Like added" };
}

// Ver quem deu like (opcional)
export async function getCommentLikesService(commentId) {
  const likes = await prisma.commentLike.findMany({
    where: { commentId },
    include: {
      user: { select: { id: true, nickName: true, avatar: true } }
    }
  });

  return {
    total: likes.length,
    users: likes.map(l => l.user)
  };
}
