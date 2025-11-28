import { z } from "zod";

export const updateProfileSchema = z.object({
  bio: z.string().optional(),
  preferences: z.any().optional(),
  language: z.string().optional()
});

export const updatePrivacySchema = z.object({
  privacy: z.enum(["PUBLIC", "FRIENDS", "PRIVATE"])
});

export const updateAvatarSchema = z.object({
  avatar: z.string().url("Invalid avatar URL")
});
