import { Module } from '@nestjs/common';
import { PackagesModule } from './packages/packages.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, PackagesModule]
})
export class AppModule {}
