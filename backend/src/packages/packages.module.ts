import { Module } from '@nestjs/common';
import { AdminPackagesController } from './admin-packages.controller';
import { MobilePackagesController } from './mobile-packages.controller';
import { PackagesRepository } from './packages.repository';
import { PackagesService } from './packages.service';

@Module({
  controllers: [AdminPackagesController, MobilePackagesController],
  providers: [PackagesRepository, PackagesService]
})
export class PackagesModule {}
