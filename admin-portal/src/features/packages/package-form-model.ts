import {
  CreatePackageInput,
  PackageResponse,
  PACKAGE_DESCRIPTION_MAX_LENGTH,
  PACKAGE_DURATION_MAX_MINUTES,
  PACKAGE_NAME_MAX_LENGTH,
  createPackageSchema
} from '@wellness/shared';
import { z } from 'zod';
import { centsToDisplayPrice, displayPriceToCents } from '../../lib/format';

export const packageFormSchema = z.object({
  name: z.string().trim().min(1).max(PACKAGE_NAME_MAX_LENGTH),
  description: z.string().trim().min(1).max(PACKAGE_DESCRIPTION_MAX_LENGTH),
  price: z.coerce.number().min(0),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(1)
    .max(PACKAGE_DURATION_MAX_MINUTES)
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;

export const emptyPackageFormValues: PackageFormValues = {
  name: '',
  description: '',
  price: 0,
  durationMinutes: 60
};

export function toPackageRequest(
  values: PackageFormValues
): CreatePackageInput {
  return createPackageSchema.parse({
    name: values.name,
    description: values.description,
    priceCents: displayPriceToCents(values.price),
    durationMinutes: values.durationMinutes
  });
}

export function toPackageFormValues(
  wellnessPackage: PackageResponse
): PackageFormValues {
  return {
    name: wellnessPackage.name,
    description: wellnessPackage.description,
    price: Number(centsToDisplayPrice(wellnessPackage.priceCents)),
    durationMinutes: wellnessPackage.durationMinutes
  };
}
