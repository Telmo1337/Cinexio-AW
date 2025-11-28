import { z } from "zod";

// Schema para atualizar perfil do utilizador
export const updateProfileSchema = z.object({
  bio: z.string().optional(),
  preferences: z.any().optional(),
  language: z.string().optional()
});


// Schema para atualizar configurações de privacidade do utilizador
export const updatePrivacySchema = z.object({
  privacy: z.enum(["PUBLIC", "FRIENDS", "PRIVATE"])
});

// Schema para atualizar avatar do utilizador
export const updateAvatarSchema = z.object({
  avatar: z.string().url("Invalid avatar URL")
});
