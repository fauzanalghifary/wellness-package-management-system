import { UseFormReturn } from 'react-hook-form';
import { PackageFormValues } from './package-form-model';

type PackageFormModalProps = {
  form: UseFormReturn<PackageFormValues>;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: PackageFormValues) => void;
  title: string;
};

export function PackageFormModal({
  form,
  isSaving,
  onClose,
  onSubmit,
  title
}: PackageFormModalProps): JSX.Element {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/45 px-4">
      <form
        className="w-full max-w-xl rounded-lg bg-paper p-6 shadow-2xl"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            className="rounded-md border border-ink/20 px-3 py-2 text-sm"
            type="button"
            onClick={onClose}
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
          <FieldError message={form.formState.errors.description?.message} />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-moss">Price (USD)</span>
            <div className="relative mt-1">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-ink/60"
              >
                $
              </span>
              <input
                aria-label="Price in US dollars"
                className="h-11 w-full rounded-md border border-ink/20 bg-white pl-7 pr-3 outline-none transition focus:border-moss"
                min="0"
                step="0.01"
                type="number"
                {...form.register('price')}
              />
            </div>
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
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            Save package
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldError({ message }: { message?: string }): JSX.Element | null {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm text-clay">{message}</p>;
}
