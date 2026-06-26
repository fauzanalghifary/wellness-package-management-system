import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePackageInput,
  PackageListResponse,
  PackageResponse,
  UpdatePackageInput
} from '@wellness/shared';
import { toPackageResponse } from './package.mapper';
import { PackagesRepository } from './packages.repository';

@Injectable()
export class PackagesService {
  constructor(private readonly packagesRepository: PackagesRepository) {}

  async findForAdmin(): Promise<PackageListResponse> {
    const packages = await this.packagesRepository.findManyVisible();

    return {
      items: packages.map(toPackageResponse)
    };
  }

  async findOneForAdmin(id: string): Promise<PackageResponse> {
    const wellnessPackage = await this.packagesRepository.findVisibleById(id);

    if (!wellnessPackage) {
      throw this.notFound();
    }

    return toPackageResponse(wellnessPackage);
  }

  async findForMobile(): Promise<PackageListResponse> {
    const packages = await this.packagesRepository.findManyVisible();

    return {
      items: packages.map(toPackageResponse)
    };
  }

  async create(input: CreatePackageInput): Promise<PackageResponse> {
    const createdPackage = await this.packagesRepository.create(input);

    return toPackageResponse(createdPackage);
  }

  async update(
    id: string,
    input: UpdatePackageInput
  ): Promise<PackageResponse> {
    const existingPackage = await this.packagesRepository.findVisibleById(id);

    if (!existingPackage) {
      throw this.notFound();
    }

    const updatedPackage = await this.packagesRepository.update(id, input);

    return toPackageResponse(updatedPackage);
  }

  async softDelete(id: string): Promise<void> {
    const existingPackage = await this.packagesRepository.findVisibleById(id);

    if (!existingPackage) {
      throw this.notFound();
    }

    await this.packagesRepository.softDelete(id);
  }

  private notFound(): NotFoundException {
    return new NotFoundException({
      error: {
        code: 'PACKAGE_NOT_FOUND',
        message: 'Package not found'
      }
    });
  }
}
