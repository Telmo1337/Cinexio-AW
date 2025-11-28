// Camada de serviços das listas: contém toda a lógica de regras + Prisma

import { prisma } from "../db/prisma.js";
import { listCreateSchema, listPrivacySchema } from "../schemas/list.schema.js";


// CRIAR LISTA
export async function createListService(userId, body) {

  const parsed = listCreateSchema.safeParse(body);
  if (!parsed.success) {
    throw new Error(parsed.error.flatten().fieldErrors.name?.[0]);
  }

  return await prisma.list.create({
    data: {
      name: parsed.data.name,
      privacy: parsed.data.privacy || "PRIVATE",
      userId
    }
  });
}



// LISTAS DO UTILIZADOR (MY LISTS)
export async function getMyListsService(userId) {

  return await prisma.list.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });
}



// VER LISTA POR ID (RESPEITAR PRIVACIDADE)
export async function getListByIdService(listId, requesterId) {

  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: {
      user: { select: { id: true, nickName: true } },
      items: {
        include: { media: true },
      },
    },
  });

  if (!list) throw new Error("List not found");

  // Lista privada → só dono pode ver
  if (list.privacy === "PRIVATE" && list.userId !== requesterId) {
    throw new Error("This list is private");
  }

  return list;
}



// APAGAR LISTA
export async function deleteListService(listId, userId) {

  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new Error("List not found");

  if (list.userId !== userId) {
    throw new Error("Not allowed to delete this list");
  }

  // Apagar items da lista
  await prisma.listItem.deleteMany({ where: { listId } });

  // Apagar lista
  await prisma.list.delete({ where: { id: listId } });

  return { message: "List deleted successfully" };
}



// ALTERAR PRIVACIDADE
export async function changeListPrivacyService(listId, userId, body) {

  const parsed = listPrivacySchema.safeParse(body);
  if (!parsed.success) {
    throw new Error(parsed.error.flatten().fieldErrors.privacy?.[0]);
  }

  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new Error("List not found");

  if (list.userId !== userId) {
    throw new Error("Not allowed to update privacy");
  }

  return await prisma.list.update({
    where: { id: listId },
    data: { privacy: parsed.data.privacy }
  });
}



// ADICIONAR MEDIA À LISTA
export async function addMediaToListService(listId, mediaId, userId) {

  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new Error("List not found");

  if (list.userId !== userId) {
    throw new Error("Not allowed to modify this list");
  }

  // Verificar se media já está na lista
  const exists = await prisma.listItem.findFirst({
    where: { listId, mediaId }
  });

  if (exists) {
    throw new Error("Media already in this list");
  }

  return await prisma.listItem.create({
    data: { listId, mediaId }
  });
}



// REMOVER MEDIA DA LISTA
export async function removeMediaFromListService(listId, mediaId, userId) {

  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new Error("List not found");

  if (list.userId !== userId) {
    throw new Error("Not allowed to modify this list");
  }

  await prisma.listItem.deleteMany({
    where: { listId, mediaId }
  });

  return { message: "Media removed from list" };
}
