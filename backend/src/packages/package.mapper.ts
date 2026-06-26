import { PackageResponse } from '@wellness/shared';
import { WellnessPackage } from '@prisma/client';

export function toPackageResponse(record: WellnessPackage): PackageResponse {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    priceCents: record.priceCents,
    durationMinutes: record.durationMinutes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}
