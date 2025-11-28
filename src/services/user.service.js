// Camada de serviço: contém toda a lógica e interage com a BD via Prisma

import { prisma } from "../db/prisma.js";


// VER PERFIL COM REGRAS DE PRIVACIDADE
export async function getUserProfileService(nickName, requesterUser) {

  // Procurar utilizador pelo nickName
  const user = await prisma.user.findUnique({
    where: { nickName },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickName: true,
      avatar: true,
      bio: true,
      preferences: true,
      language: true,
      privacy: true,
      createdAt: true
    }
  });

  if (!user) throw new Error("User not found");

  // Regra 1 — o próprio pode sempre ver
  if (requesterUser.nickName === nickName) {
    return { access: "SELF", profile: user };
  }

  // Regra 2 — Público
  if (user.privacy === "PUBLIC") {
    return { access: "PUBLIC", profile: user };
  }

  // Regra 3 — Friends (não implementado)
  if (user.privacy === "FRIENDS") {
    throw new Error("This profile is only visible to friends");
  }

  // Regra 4 — Privado
  if (user.privacy === "PRIVATE") {
    throw new Error("This profile is private");
  }
}


// LISTAR USERS (ADMIN)
export async function getAllUsersService(page = 1, pageSize = 10) {

  page = Number(page);
  pageSize = Number(pageSize);

  const skip = (page - 1) * pageSize;

  const totalUsers = await prisma.user.count();

  const users = await prisma.user.findMany({
    skip,
    take: pageSize,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickName: true,
      email: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  return {
    page,
    pageSize,
    totalUsers,
    totalPages: Math.ceil(totalUsers / pageSize),
    count: users.length,
    data: users
  };
}


// OBTER MEDIA CRIADOS POR UM USER
export async function getUserMediaService(nickName, page = 1, pageSize = 10) {

  page = Number(page);
  pageSize = Number(pageSize);
  const skip = (page - 1) * pageSize;

  // Verificar se o user existe
  const user = await prisma.user.findUnique({
    where: { nickName },
    select: { id: true, nickName: true }
  });

  if (!user) throw new Error("User not found");

  const totalMedia = await prisma.media.count({
    where: { userId: user.id }
  });

  const mediaList = await prisma.media.findMany({
    where: { userId: user.id },
    skip,
    take: pageSize,
    include: {
      user: { select: { id: true, nickName: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return {
    user: user.nickName,
    page,
    pageSize,
    totalMedia,
    totalPages: Math.ceil(totalMedia / pageSize),
    count: mediaList.length,
    data: mediaList
  };
}


// ATUALIZAR PERFIL
export async function updateUserProfileService(userId, body) {

  const { bio, preferences, language } = body;

  return prisma.user.update({
    where: { id: userId },
    data: { bio, preferences, language },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickName: true,
      bio: true,
      preferences: true,
      language: true,
      updatedAt: true
    }
  });
}


// ATUALIZAR PRIVACIDADE
export async function updateUserPrivacyService(userId, privacy) {

  if (!["PUBLIC", "FRIENDS", "PRIVATE"].includes(privacy)) {
    throw new Error("Invalid privacy value");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { privacy },
    select: {
      id: true,
      nickName: true,
      privacy: true
    }
  });
}


// ATUALIZAR AVATAR
export async function updateUserAvatarService(userId, avatar) {

  if (!avatar) throw new Error("Avatar URL is required");

  return prisma.user.update({
    where: { id: userId },
    data: { avatar }
  });
}
