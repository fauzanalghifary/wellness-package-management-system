'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreatePackageInput, PackageResponse } from '@wellness/shared';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PackageFormModal } from '../features/packages/package-form-modal';
import {
  emptyPackageFormValues,
  PackageFormValues,
  packageFormSchema,
  toPackageFormValues,
  toPackageRequest
} from '../features/packages/package-form-model';
import { PackageTable } from '../features/packages/package-table';
import {
  createPackage,
  deletePackage,
  listPackages,
  updatePackage
} from '../lib/api/packages';

export default function AdminPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [editingPackage, setEditingPackage] = useState<PackageResponse | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const packagesQuery = useQuery({
    queryKey: ['packages'],
    queryFn: listPackages
  });

  const packages = packagesQuery.data?.items ?? [];

  const formTitle = editingPackage ? 'Edit package' : 'New package';

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: emptyPackageFormValues
  });

  const createMutation = useMutation({
    mutationFn: createPackage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['packages'] });
      closeForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreatePackageInput }) =>
      updatePackage(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['packages'] });
      closeForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['packages'] });
    }
  });

  const mutationError = useMemo(() => {
    const error =
      createMutation.error ?? updateMutation.error ?? deleteMutation.error;
    return error instanceof Error ? error.message : null;
  }, [createMutation.error, deleteMutation.error, updateMutation.error]);

  function openCreateForm(): void {
    setEditingPackage(null);
    form.reset(emptyPackageFormValues);
    setIsFormOpen(true);
  }

  function openEditForm(wellnessPackage: PackageResponse): void {
    setEditingPackage(wellnessPackage);
    form.reset(toPackageFormValues(wellnessPackage));
    setIsFormOpen(true);
  }

  function closeForm(): void {
    setIsFormOpen(false);
    setEditingPackage(null);
    form.reset(emptyPackageFormValues);
  }

  function handleDelete(wellnessPackage: PackageResponse): void {
    const confirmed = window.confirm(`Delete ${wellnessPackage.name}?`);

    if (confirmed) {
      deleteMutation.mutate(wellnessPackage.id);
    }
  }

  function handleSubmit(values: PackageFormValues): void {
    const input = toPackageRequest(values);

    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage.id, input });
      return;
    }

    createMutation.mutate(input);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-8 text-ink md:px-8">
      <header className="flex flex-col justify-between gap-4 border-b border-ink/15 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            Wellness Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal md:text-5xl">
            Package catalog
          </h1>
        </div>
        <button
          className="h-11 rounded-md bg-ink px-5 text-sm font-semibold text-paper shadow-sm transition hover:bg-moss"
          type="button"
          onClick={openCreateForm}
        >
          New package
        </button>
      </header>

      {mutationError ? (
        <div className="rounded-md border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-ink">
          {mutationError}
        </div>
      ) : null}

      <PackageTable
        isError={packagesQuery.isError}
        isLoading={packagesQuery.isLoading}
        onDelete={handleDelete}
        onEdit={openEditForm}
        packages={packages}
      />

      {isFormOpen ? (
        <PackageFormModal
          form={form}
          isSaving={createMutation.isPending || updateMutation.isPending}
          onClose={closeForm}
          onSubmit={handleSubmit}
          title={formTitle}
        />
      ) : null}
    </main>
  );
}
