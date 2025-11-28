// Camada de serviços onde reside a lógica dos comentários

import { prisma } from "../db/prisma.js";
import { updateCommentSchema } from "../schemas/comments.schema.js";


// LISTAR TODOS OS COMENTÁRIOS FEITOS POR UM UTILIZADOR
export async function getCommentsByUserService(nickName) {

  // Obter todos os comentários feitos pelo user
  const comments = await prisma.comment.findMany({
    where: {
      user: { nickName }
    },
    include: {
      media: { select: { id: true, title: true } },
      user: { select: { id: true, nickName: true } }
    }
  });

  return comments;
}



// EDITAR COMENTÁRIO (apenas autor)
export async function updateCommentService(commentId, body, user) {

  // Validar conteúdo
  const parsed = updateCommentSchema.safeParse(body);
  if (!parsed.success) {
    throw new Error(parsed.error.flatten().fieldErrors.content?.[0]);
  }

  // Obter comentário
  const comment = await prisma.comment.findUnique({
    where: { id: commentId }
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  // Verificar se pertence ao utilizador autenticado
  if (comment.userId !== user.id) {
    throw new Error("Not allowed to edit this comment");
  }

  // Atualizar comentário
  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { content: parsed.data.content }
  });

  return updated;
}



// APAGAR COMENTÁRIO (autor ou admin)
export async function deleteCommentService(commentId, user) {

  const comment = await prisma.comment.findUnique({
    where: { id: commentId }
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  // Permitir apagar apenas:
  // → autor do comentário
  // → admin
  if (comment.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not allowed to delete this comment");
  }

  // Apagar comentário
  await prisma.comment.delete({
    where: { id: commentId }
  });

  return { message: "Comment deleted successfully" };
}
