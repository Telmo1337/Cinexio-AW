// Camada de serviço:
// - Contém toda a lógica da aplicação
// - Liga-se à base de dados via Prisma
// - Trata hashing, tokens, verificações, etc.

import { prisma } from "../db/prisma.js";
import crypto from "crypto";
import { hashPassword, checkPassword, generateToken } from "../utils/auth.js";

// Função auxiliar para gerar refresh tokens seguros
function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}

// REGISTAR UTILIZADOR
export async function registerUser({ email, firstName, lastName, nickName, password }) {

  // Verificar se email ou nickName já existem
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { nickName }] }
  });

  if (existing) {
    throw new Error(existing.email === email ? "Email already in use" : "Nickname already in use");
  }

  // Primeiro utilizador do sistema é ADMIN
  const userCount = await prisma.user.count();
  const role = userCount === 0 ? "ADMIN" : "MEMBER";

  // Encriptar palavra-passe
  const hashed = await hashPassword(password);

  // Criar utilizador na BD
  const user = await prisma.user.create({
    data: { email, firstName, lastName, nickName, password: hashed, role },
  });

  // Gerar token de acesso (JWT)
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    nickName: user.nickName
  });

  // Remover password do objeto antes de retornar
  const { password: _, ...cleanUser } = user;

  return { user: cleanUser, token };
}

// LOGIN
export async function loginUser({ identifier, password }) {

  // Procurar user por email ou nickname
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { nickName: identifier }]
    }
  });

  if (!user) throw new Error("User not found");

  // Verificar se a password está correta
  const valid = await checkPassword(password, user.password);
  if (!valid) throw new Error("Incorrect password");

  // Criar JWT
  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    nickName: user.nickName
  });

  // Criar refresh token e guardar na BD
  const refreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id }
  });

  // Remover password para segurança
  const { password: _, ...cleanUser } = user;

  return {
    message: "Login successful",
    user: cleanUser,
    token: accessToken,
    refreshToken
  };
}

// LOGOUT (remoção do refresh token)
export async function logoutUser(refreshToken) {
  if (!refreshToken) throw new Error("Refresh token is required");

  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });

  return { message: "Logged out successfully" };
}

// PEDIDO DE RECUPERAÇÃO DA PASSWORD
export async function forgotPasswordService(email) {

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  // Criar token único temporário (15 min)
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  await prisma.passwordReset.create({
    data: { token, userId: user.id, expiresAt }
  });

  return {
    message: "Password reset token generated",
    resetToken: token // simulação de envio por email
  };
}

// DEFINIR NOVA PASSWORD
export async function resetPasswordService(token, newPassword) {

  // Verificar se o token é válido e não foi usado
  const record = await prisma.passwordReset.findFirst({
    where: { token, used: false },
    include: { user: true }
  });

  if (!record) throw new Error("Invalid token");
  if (record.expiresAt < new Date()) throw new Error("Token expired");

  // Encriptar nova password
  const hashed = await hashPassword(newPassword);

  // Atualizar password do user
  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashed }
  });

  // Marcar token como usado
  await prisma.passwordReset.update({
    where: { id: record.id },
    data: { used: true }
  });

  return { message: "Password updated successfully" };
}
