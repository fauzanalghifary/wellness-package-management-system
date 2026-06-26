import { z } from 'zod';

export const PACKAGE_NAME_MAX_LENGTH = 120;
export const PACKAGE_DESCRIPTION_MAX_LENGTH = 1000;
export const PACKAGE_DURATION_MAX_MINUTES = 1440;

export const packageResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(PACKAGE_NAME_MAX_LENGTH),
  description: z.string().min(1).max(PACKAGE_DESCRIPTION_MAX_LENGTH),
  priceCents: z.number().int().min(0),
  durationMinutes: z.number().int().min(1).max(PACKAGE_DURATION_MAX_MINUTES),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const packageListResponseSchema = z.object({
  items: z.array(packageResponseSchema)
});

export const createPackageSchema = z.object({
  name: z.string().trim().min(1).max(PACKAGE_NAME_MAX_LENGTH),
  description: z.string().trim().min(1).max(PACKAGE_DESCRIPTION_MAX_LENGTH),
  priceCents: z.number().int().min(0),
  durationMinutes: z.number().int().min(1).max(PACKAGE_DURATION_MAX_MINUTES)
});

export const updatePackageSchema = createPackageSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required'
  });

export type PackageResponse = z.infer<typeof packageResponseSchema>;
export type PackageListResponse = z.infer<typeof packageListResponseSchema>;
export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
