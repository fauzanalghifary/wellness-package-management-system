import { Injectable } from '@nestjs/common';
import { Prisma, WellnessPackage } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const visiblePackageWhere = {
  deletedAt: null
} satisfies Prisma.WellnessPackageWhereInput;

@Injectable()
export class PackagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findManyVisible(): Promise<WellnessPackage[]> {
    return this.prisma.wellnessPackage.findMany({
      where: visiblePackageWhere,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findVisibleById(id: string): Promise<WellnessPackage | null> {
    return this.prisma.wellnessPackage.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  create(data: Prisma.WellnessPackageCreateInput): Promise<WellnessPackage> {
    return this.prisma.wellnessPackage.create({ data });
  }

  update(
    id: string,
    data: Prisma.WellnessPackageUpdateInput
  ): Promise<WellnessPackage> {
    return this.prisma.wellnessPackage.update({
      where: { id },
      data
    });
  }

  softDelete(id: string): Promise<WellnessPackage> {
    return this.prisma.wellnessPackage.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
