import { z } from "zod";

// Validação da atualização de uma entrada da biblioteca
export const updateLibrarySchema = z.object({
  favorite: z.boolean().optional(),
  watched: z.boolean().optional(),
  rating: z.number().min(0).max(10).optional(),
  notes: z.string().optional(),
  calendarAt: z.string().datetime().nullable().optional()
});
