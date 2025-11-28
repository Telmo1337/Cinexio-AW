import { z } from "zod";

// Criar lista
export const listCreateSchema = z.object({
  name: z.string().min(1, "List name is required"),
  privacy: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

// Alterar privacidade
export const listPrivacySchema = z.object({
  privacy: z.enum(["PUBLIC", "PRIVATE"]),
});
