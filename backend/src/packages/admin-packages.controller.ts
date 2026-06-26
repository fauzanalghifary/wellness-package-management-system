import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { PackageListResponse, PackageResponse } from '@wellness/shared';
import {
  CreatePackageDto,
  PackageListResponseDto,
  PackageResponseDto,
  UpdatePackageDto
} from './packages.dto';
import { PackagesService } from './packages.service';

@ApiTags('Admin packages')
@Controller('admin/packages')
export class AdminPackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @ApiOperation({ summary: 'List packages for admin management' })
  @ApiResponse({ status: 200, type: PackageListResponseDto })
  findAll(): Promise<PackageListResponse> {
    return this.packagesService.findForAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create a wellness package' })
  @ApiBody({ type: CreatePackageDto })
  @ApiResponse({ status: 201, type: PackageResponseDto })
  create(@Body() body: CreatePackageDto): Promise<PackageResponse> {
    return this.packagesService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one wellness package' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: PackageResponseDto })
  @ApiResponse({ status: 404, description: 'Package not found' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<PackageResponse> {
    return this.packagesService.findOneForAdmin(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a wellness package' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdatePackageDto })
  @ApiResponse({ status: 200, type: PackageResponseDto })
  @ApiResponse({ status: 404, description: 'Package not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdatePackageDto
  ): Promise<PackageResponse> {
    return this.packagesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft-delete a wellness package' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Package deleted' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.packagesService.softDelete(id);
  }
}
