export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(priceCents / 100);
}

export function centsToDisplayPrice(priceCents: number): string {
  return (priceCents / 100).toFixed(2);
}

export function displayPriceToCents(price: number): number {
  return Math.round(price * 100);
}
