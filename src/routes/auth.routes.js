// Rotas responsáveis pela autenticação dos utilizadores

import { Router } from "express";

// Importar funções do controller
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

// Criar router isolado para o módulo de autenticação
const router = Router();

// Rota de registo
router.post("/register", register);

// Rota de login
router.post("/login", login);

// Rota de logout (remoção do refresh token)
router.post("/logout", logout);

// Rota para solicitar recuperação da palavra-passe
router.post("/forgot-password", forgotPassword);

// Rota para redefinir a palavra-passe
router.post("/reset-password", resetPassword);

// Exportar router para ser usado na aplicação
export default router;
