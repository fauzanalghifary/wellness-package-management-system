import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  createPackageSchema,
  CreatePackageInput,
  PackageListResponse,
  PackageResponse,
  updatePackageSchema,
  UpdatePackageInput
} from '@wellness/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { PackagesService } from './packages.service';
import {
  createPackageOpenApiSchema,
  packageListResponseOpenApiSchema,
  packageResponseOpenApiSchema
} from './swagger';

@ApiTags('Admin packages')
@Controller('admin/packages')
export class AdminPackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @ApiOperation({ summary: 'List packages for admin management' })
  @ApiResponse({ status: 200, schema: packageListResponseOpenApiSchema })
  findAll(): Promise<PackageListResponse> {
    return this.packagesService.findForAdmin();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createPackageSchema))
  @ApiOperation({ summary: 'Create a wellness package' })
  @ApiBody({ schema: createPackageOpenApiSchema })
  @ApiResponse({ status: 201, schema: packageResponseOpenApiSchema })
  create(@Body() body: CreatePackageInput): Promise<PackageResponse> {
    return this.packagesService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one wellness package' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, schema: packageResponseOpenApiSchema })
  @ApiResponse({ status: 404, description: 'Package not found' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<PackageResponse> {
    return this.packagesService.findOneForAdmin(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updatePackageSchema))
  @ApiOperation({ summary: 'Partially update a wellness package' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: createPackageOpenApiSchema })
  @ApiResponse({ status: 200, schema: packageResponseOpenApiSchema })
  @ApiResponse({ status: 404, description: 'Package not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdatePackageInput
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
