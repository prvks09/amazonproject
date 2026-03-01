// do **not** export a single mutable cart instance.  Always read a fresh copy
// from localStorage when you need the current state.  This prevents the stale
// data issue [TEST-7]s described earlier.

// storage key constant must exist before any function references it
const STORAGE_KEY = "cart";

// convenience function used internally and by consumers
export function loadCartFromStorage() {
  try {
    console.log("inside try, ", JSON.parse(localStorage.getItem(STORAGE_KEY)));
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// note: we keep initCart for debugging but it no longer runs on module load
// since there is no exported `cart` variable to pass.
// initCart(loadCartFromStorage());

// optionally export loadCart if some consumers need to refresh
// (it's already exported above)

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

function initCart(cart) {
  console.log("Inside cartMap cart variable: ", cart);

  let cartMap = new Map(cart.map((cart) => [cart.productId, cart.quantity]));
  console.log("Inside cartMap: ", cartMap);

  // Show all items
  for (let [productId, quantity] of cartMap.entries()) {
    console.log("Product:", productId, "Quantity:", quantity);
  }
}

// when we save, we require the caller to provide the cart array so there is
// no hidden dependency on a module‑scoped variable.
export function saveCart(newCart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
  console.log("saving cart in local ", newCart);
}

// export function removeFromCart(productId) { … } // etc.

export function addToCart(productId, selectedQuantity) {
  // always operate on the latest cart from storage
  const cart = loadCartFromStorage();

  const matchingItem = cart.find(
    (cartItem) => cartItem.productId === productId,
  );

  if (matchingItem) {
    matchingItem.quantity += selectedQuantity;
  } else {
    cart.push({
      productId: productId,
      quantity: selectedQuantity,
    });
  }

  console.log("cart item pushed", productId, selectedQuantity);
  console.log("Total Cart Quantity list ", cart);
  saveCart(cart);
  return cart; // return new array for convenience if caller wants it
}
