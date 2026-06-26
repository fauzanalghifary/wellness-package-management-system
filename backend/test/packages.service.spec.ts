import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { PackagesService } from '../src/packages/packages.service';
import { PackagesRepository } from '../src/packages/packages.repository';

const now = new Date('2026-06-25T10:00:00.000Z');

const packageRecord = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Deep Tissue Massage',
  description: 'A focused massage session for muscle tension and recovery.',
  priceCents: 7500,
  durationMinutes: 60,
  deletedAt: null,
  createdAt: now,
  updatedAt: now
};

function createRepositoryMock(): Pick<
  PackagesRepository,
  'findManyVisible' | 'findVisibleById' | 'create' | 'update' | 'softDelete'
> {
  return {
    findManyVisible: vi.fn(),
    findVisibleById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn()
  };
}

describe('PackagesService', () => {
  it('lists visible packages for mobile without exposing deletedAt', async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findManyVisible).mockResolvedValue([packageRecord]);
    const service = new PackagesService(repository as PackagesRepository);

    await expect(service.findForMobile()).resolves.toEqual({
      items: [
        {
          id: packageRecord.id,
          name: packageRecord.name,
          description: packageRecord.description,
          priceCents: packageRecord.priceCents,
          durationMinutes: packageRecord.durationMinutes,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        }
      ]
    });
  });

  it('creates a package', async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.create).mockResolvedValue(packageRecord);
    const service = new PackagesService(repository as PackagesRepository);

    const result = await service.create({
      name: packageRecord.name,
      description: packageRecord.description,
      priceCents: packageRecord.priceCents,
      durationMinutes: packageRecord.durationMinutes
    });

    expect(repository.create).toHaveBeenCalledWith({
      name: packageRecord.name,
      description: packageRecord.description,
      priceCents: packageRecord.priceCents,
      durationMinutes: packageRecord.durationMinutes
    });
    expect(result.id).toBe(packageRecord.id);
  });

  it('updates an existing package', async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findVisibleById).mockResolvedValue(packageRecord);
    vi.mocked(repository.update).mockResolvedValue({
      ...packageRecord,
      name: 'Updated Massage'
    });
    const service = new PackagesService(repository as PackagesRepository);

    const result = await service.update(packageRecord.id, {
      name: 'Updated Massage'
    });

    expect(repository.update).toHaveBeenCalledWith(packageRecord.id, {
      name: 'Updated Massage'
    });
    expect(result.name).toBe('Updated Massage');
  });

  it('throws not found when updating a missing package', async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findVisibleById).mockResolvedValue(null);
    const service = new PackagesService(repository as PackagesRepository);

    await expect(
      service.update(packageRecord.id, { name: 'Missing' })
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('soft deletes an existing package', async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findVisibleById).mockResolvedValue(packageRecord);
    vi.mocked(repository.softDelete).mockResolvedValue({
      ...packageRecord,
      deletedAt: now
    });
    const service = new PackagesService(repository as PackagesRepository);

    await service.softDelete(packageRecord.id);

    expect(repository.softDelete).toHaveBeenCalledWith(packageRecord.id);
  });
});
