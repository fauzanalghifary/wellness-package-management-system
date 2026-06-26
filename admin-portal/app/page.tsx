'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreatePackageInput,
  PackageResponse,
  PACKAGE_DESCRIPTION_MAX_LENGTH,
  PACKAGE_DURATION_MAX_MINUTES,
  PACKAGE_NAME_MAX_LENGTH,
  createPackageSchema
} from '@wellness/shared';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createPackage,
  deletePackage,
  listPackages,
  updatePackage
} from '../src/lib/api/packages';
import {
  centsToDisplayPrice,
  displayPriceToCents,
  formatPrice
} from '../src/lib/format';

const packageFormSchema = z.object({
  name: z.string().trim().min(1).max(PACKAGE_NAME_MAX_LENGTH),
  description: z.string().trim().min(1).max(PACKAGE_DESCRIPTION_MAX_LENGTH),
  price: z.coerce.number().min(0),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(1)
    .max(PACKAGE_DURATION_MAX_MINUTES)
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

const emptyFormValues: PackageFormValues = {
  name: '',
  description: '',
  price: 0,
  durationMinutes: 60
};

function toRequest(values: PackageFormValues): CreatePackageInput {
  return createPackageSchema.parse({
    name: values.name,
    description: values.description,
    priceCents: displayPriceToCents(values.price),
    durationMinutes: values.durationMinutes
  });
}

function toFormValues(wellnessPackage: PackageResponse): PackageFormValues {
  return {
    name: wellnessPackage.name,
    description: wellnessPackage.description,
    price: Number(centsToDisplayPrice(wellnessPackage.priceCents)),
    durationMinutes: wellnessPackage.durationMinutes
  };
}

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
    defaultValues: emptyFormValues
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
    form.reset(emptyFormValues);
    setIsFormOpen(true);
  }

  function openEditForm(wellnessPackage: PackageResponse): void {
    setEditingPackage(wellnessPackage);
    form.reset(toFormValues(wellnessPackage));
    setIsFormOpen(true);
  }

  function closeForm(): void {
    setIsFormOpen(false);
    setEditingPackage(null);
    form.reset(emptyFormValues);
  }

  function handleDelete(wellnessPackage: PackageResponse): void {
    const confirmed = window.confirm(`Delete ${wellnessPackage.name}?`);

    if (confirmed) {
      deleteMutation.mutate(wellnessPackage.id);
    }
  }

  function handleSubmit(values: PackageFormValues): void {
    const input = toRequest(values);

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

      <section className="overflow-hidden rounded-lg border border-ink/15 bg-paper shadow-sm">
        <div className="grid grid-cols-[1.3fr_0.8fr_0.6fr_0.7fr] gap-4 border-b border-ink/10 bg-mint/45 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-moss">
          <span>Package</span>
          <span>Price</span>
          <span>Duration</span>
          <span className="text-right">Actions</span>
        </div>

        {packagesQuery.isLoading ? (
          <div className="px-4 py-10 text-center text-sm text-moss">
            Loading packages...
          </div>
        ) : null}

        {packagesQuery.isError ? (
          <div className="px-4 py-10 text-center text-sm text-clay">
            Unable to load packages.
          </div>
        ) : null}

        {!packagesQuery.isLoading &&
        !packagesQuery.isError &&
        packages.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-moss">
            No packages yet. Create the first one to populate the catalog.
          </div>
        ) : null}

        {packages.map((wellnessPackage) => (
          <article
            className="grid grid-cols-[1.3fr_0.8fr_0.6fr_0.7fr] gap-4 border-b border-ink/10 px-4 py-4 last:border-b-0"
            key={wellnessPackage.id}
          >
            <div>
              <h2 className="font-semibold">{wellnessPackage.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-moss">
                {wellnessPackage.description}
              </p>
            </div>
            <div className="self-center text-sm font-medium">
              {formatPrice(wellnessPackage.priceCents)}
            </div>
            <div className="self-center text-sm text-moss">
              {wellnessPackage.durationMinutes} min
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                className="rounded-md border border-ink/20 px-3 py-2 text-sm font-medium transition hover:border-moss hover:text-moss"
                type="button"
                onClick={() => openEditForm(wellnessPackage)}
              >
                Edit
              </button>
              <button
                className="rounded-md border border-clay/30 px-3 py-2 text-sm font-medium text-clay transition hover:bg-clay hover:text-paper"
                type="button"
                onClick={() => handleDelete(wellnessPackage)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      {isFormOpen ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/45 px-4">
          <form
            className="w-full max-w-xl rounded-lg bg-paper p-6 shadow-2xl"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">{formTitle}</h2>
              <button
                className="rounded-md border border-ink/20 px-3 py-2 text-sm"
                type="button"
                onClick={closeForm}
              >
                Close
              </button>
            </div>

            <label className="mb-4 block">
              <span className="text-sm font-medium text-moss">Name</span>
              <input
                className="mt-1 h-11 w-full rounded-md border border-ink/20 bg-white px-3 outline-none transition focus:border-moss"
                {...form.register('name')}
              />
              <FieldError message={form.formState.errors.name?.message} />
            </label>

            <label className="mb-4 block">
              <span className="text-sm font-medium text-moss">Description</span>
              <textarea
                className="mt-1 min-h-28 w-full rounded-md border border-ink/20 bg-white px-3 py-2 outline-none transition focus:border-moss"
                {...form.register('description')}
              />
              <FieldError
                message={form.formState.errors.description?.message}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-moss">Price</span>
                <input
                  className="mt-1 h-11 w-full rounded-md border border-ink/20 bg-white px-3 outline-none transition focus:border-moss"
                  min="0"
                  step="0.01"
                  type="number"
                  {...form.register('price')}
                />
                <FieldError message={form.formState.errors.price?.message} />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-moss">
                  Duration minutes
                </span>
                <input
                  className="mt-1 h-11 w-full rounded-md border border-ink/20 bg-white px-3 outline-none transition focus:border-moss"
                  min="1"
                  type="number"
                  {...form.register('durationMinutes')}
                />
                <FieldError
                  message={form.formState.errors.durationMinutes?.message}
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md border border-ink/20 px-4 py-2 text-sm font-semibold"
                type="button"
                onClick={closeForm}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
                disabled={createMutation.isPending || updateMutation.isPending}
                type="submit"
              >
                Save package
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}

function FieldError({ message }: { message?: string }): JSX.Element | null {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm text-clay">{message}</p>;
}
