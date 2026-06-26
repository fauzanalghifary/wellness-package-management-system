import {
  PackageListResponse,
  packageListResponseSchema
} from '@wellness/shared';

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchMobilePackages(): Promise<PackageListResponse> {
  const response = await fetch(`${apiUrl}/mobile/packages`);
  const json: unknown = await response.json();

  if (!response.ok) {
    throw new Error('Unable to load packages');
  }

  return packageListResponseSchema.parse(json);
}
