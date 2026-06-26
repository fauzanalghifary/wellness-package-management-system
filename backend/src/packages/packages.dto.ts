import {
  createPackageSchema,
  packageListResponseSchema,
  packageResponseSchema,
  updatePackageSchema
} from '@wellness/shared';
import { createZodDto } from 'nestjs-zod';

export class CreatePackageDto extends createZodDto(createPackageSchema) {}

export class UpdatePackageDto extends createZodDto(updatePackageSchema) {}

export class PackageResponseDto extends createZodDto(packageResponseSchema) {}

export class PackageListResponseDto extends createZodDto(
  packageListResponseSchema
) {}
