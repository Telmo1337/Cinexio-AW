import { z } from "zod";

// Validação do conteúdo de um comentário
export const updateCommentSchema = z.object({
  content: z.string().min(1, "Content is required")
});
