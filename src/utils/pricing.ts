interface ProductLike {
  price: number;
  discountPrice?: number;
}

// Computes the actual price to charge: price minus discountPrice (if any)
export function getFinalPrice(product: ProductLike): number {
  if (product.discountPrice && product.discountPrice > 0) {
    return product.price - product.discountPrice;
  }
  return product.price;
}