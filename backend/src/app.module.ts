import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppZodValidationPipe } from './common/app-zod-validation.pipe';
import { PackagesModule } from './packages/packages.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, PackagesModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: AppZodValidationPipe
    }
  ]
})
export class AppModule {}
