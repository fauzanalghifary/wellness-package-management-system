import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PackageListResponse } from '@wellness/shared';
import { PackageListResponseDto } from './packages.dto';
import { PackagesService } from './packages.service';

@ApiTags('Mobile packages')
@Controller('mobile/packages')
export class MobilePackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @ApiOperation({ summary: 'List packages for mobile browsing' })
  @ApiResponse({ status: 200, type: PackageListResponseDto })
  findAll(): Promise<PackageListResponse> {
    return this.packagesService.findForMobile();
  }
}
