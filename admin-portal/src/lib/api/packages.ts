import {
  CreatePackageInput,
  PackageListResponse,
  PackageResponse,
  UpdatePackageInput,
  packageListResponseSchema,
  packageResponseSchema
} from '@wellness/shared';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function parseResponse<T>(
  response: Response,
  parser: (value: unknown) => T
): Promise<T> {
  const json: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(json));
  }

  return parser(json);
}

function getErrorMessage(value: unknown): string {
  if (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'object' &&
    value.error !== null &&
    'message' in value.error &&
    typeof value.error.message === 'string'
  ) {
    return value.error.message;
  }

  return 'Request failed';
}

export async function listPackages(): Promise<PackageListResponse> {
  const response = await fetch(`${apiUrl}/admin/packages`);
  return parseResponse(response, packageListResponseSchema.parse);
}

export async function createPackage(
  input: CreatePackageInput
): Promise<PackageResponse> {
  const response = await fetch(`${apiUrl}/admin/packages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  return parseResponse(response, packageResponseSchema.parse);
}

export async function updatePackage(
  id: string,
  input: UpdatePackageInput
): Promise<PackageResponse> {
  const response = await fetch(`${apiUrl}/admin/packages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  return parseResponse(response, packageResponseSchema.parse);
}

export async function deletePackage(id: string): Promise<void> {
  const response = await fetch(`${apiUrl}/admin/packages/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const json: unknown = await response.json();
    throw new Error(getErrorMessage(json));
  }
}
