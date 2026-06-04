export function getCartLineId(productId: string, size: string): string {
  return `${productId}::${size}`;
}
