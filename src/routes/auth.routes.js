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

//criar router isolado para o módulo de autenticação
//create isolated router for auth module
const router = Router();

//rota de registo
//Registration route
router.post("/register", register);

// Rota de login
//Login route
router.post("/login", login);

//rota de logout 
//Logout route (removal of refresh token)
router.post("/logout", logout);

//rota para recuperação de palavra-passe
//Route to request password recovery
router.post("/forgot-password", forgotPassword);

//rota para redefinir a palavra-passe
//Route to reset password
router.post("/reset-password", resetPassword);


export default router;
