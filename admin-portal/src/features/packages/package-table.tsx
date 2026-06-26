import { PackageResponse } from '@wellness/shared';
import { formatPrice } from '../../lib/format';

type PackageTableProps = {
  isError: boolean;
  isLoading: boolean;
  onDelete: (wellnessPackage: PackageResponse) => void;
  onEdit: (wellnessPackage: PackageResponse) => void;
  packages: PackageResponse[];
};

export function PackageTable({
  isError,
  isLoading,
  onDelete,
  onEdit,
  packages
}: PackageTableProps): JSX.Element {
  const isEmpty = !isLoading && !isError && packages.length === 0;

  return (
    <section className="overflow-hidden rounded-lg border border-ink/15 bg-paper shadow-sm">
      <div className="grid grid-cols-[1.3fr_0.8fr_0.6fr_0.7fr] gap-4 border-b border-ink/10 bg-mint/45 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-moss">
        <span>Package</span>
        <span>Price</span>
        <span>Duration</span>
        <span className="text-right">Actions</span>
      </div>

      {isLoading ? (
        <div className="px-4 py-10 text-center text-sm text-moss">
          Loading packages...
        </div>
      ) : null}

      {isError ? (
        <div className="px-4 py-10 text-center text-sm text-clay">
          Unable to load packages.
        </div>
      ) : null}

      {isEmpty ? (
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
              onClick={() => onEdit(wellnessPackage)}
            >
              Edit
            </button>
            <button
              className="rounded-md border border-clay/30 px-3 py-2 text-sm font-medium text-clay transition hover:bg-clay hover:text-paper"
              type="button"
              onClick={() => onDelete(wellnessPackage)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
