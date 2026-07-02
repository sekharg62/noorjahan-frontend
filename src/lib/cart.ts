export function getCartLineId(productId: string, sizeId: string): string {
  return `${productId}::${sizeId}`;
}
