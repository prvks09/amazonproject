export const cart = [];

export function addToCart(productId, selectedQuantity) {
  const matchingItem = cart.find(
    (cartItem) => cartItem.productId === productId,
  );

  if (matchingItem) {
    matchingItem.quantity += selectedQuantity;
  } else {
    cart.push({
      productId: productId,
      // productName: productName,
      quantity: selectedQuantity,
    });
  }
}
