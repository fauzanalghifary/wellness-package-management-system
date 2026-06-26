import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppZodValidationPipe } from './common/app-zod-validation.pipe';
import { HealthController } from './health.controller';
import { PackagesModule } from './packages/packages.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, PackagesModule],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: AppZodValidationPipe
    }
  ]
})
export class AppModule {}
