import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PackageListResponse } from '@wellness/shared';
import { PackagesService } from './packages.service';
import { packageListResponseOpenApiSchema } from './swagger';

@ApiTags('Mobile packages')
@Controller('mobile/packages')
export class MobilePackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @ApiOperation({ summary: 'List packages for mobile browsing' })
  @ApiResponse({ status: 200, schema: packageListResponseOpenApiSchema })
  findAll(): Promise<PackageListResponse> {
    return this.packagesService.findForMobile();
  }
}
