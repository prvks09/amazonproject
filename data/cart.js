export const cart = loadCart();

// optionally export loadCart if some consumers need to refresh	export { loadCart };

// export const cart = [
//   {
//     productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
//     quantity: 2,
//   },
//   {
//     productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
//     quantity: 2,
//   },
// ];

// data/cart.js
const STORAGE_KEY = "cart";

export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  console.log("saving cart in local ", cart);
}

// export function removeFromCart(productId) { … } // etc.

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
  console.log("cart item pushed", productId, selectedQuantity);

  console.log("Total Cart Quantity list ", cart);
  saveCart();
}
