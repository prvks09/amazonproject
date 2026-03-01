import { loadCart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";

let productsHTML = "";

loadQuantity();
function loadQuantity() {
  const el = document.querySelector(".cart-quantity");
  if (!el) return;

  const cart = loadCart();
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  el.innerText = cartQuantity;
}

products.forEach((product) => {
  productsHTML += `<div class="product-container">
  <div class="product-image-container">
    <img
      class="product-image"
      src="${product.image}"
    />
  </div>

  <div class="product-name limit-text-to-2-lines">
    ${product.name}
  </div>

  <div class="product-rating-container">
    <img
      class="product-rating-stars"
      src="images/ratings/rating-${product.rating.stars * 10}.png"
    />
    <div class="product-rating-count link-primary">${product.rating.count}</div>
  </div>

  <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>

  <div class="product-quantity-container product-quantity-container-${product.id}">
    <select class = "select-quantity select-quantity-${product.id}">
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </div>

  <div class="product-spacer"></div>

  <div class="added-to-cart added-to-cart-${product.id}">
    <img src="images/icons/checkmark.png" />
    Added
  </div>

  <button class="add-to-cart-button js-add-to-cart-button button-primary" data-product-name = "${product.name}" data-product-id = "${product.id}">Add to Cart</button>
  </div>`;
});

// console.log(productsHTML);
/*
document.querySelector('.js-products-grid').append(productsHTML); // This will not work 
*/
document.querySelector(".js-products-grid").innerHTML += productsHTML;

document.querySelectorAll(".js-add-to-cart-button").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;

    const parent = button.parentElement;
    const select = parent.querySelector(".select-quantity");
    const quantity = parseInt(select.value, 10);

    console.log("quantity", quantity);

    // delegate all mutation to the shared API; it returns the updated cart
    const cart = addToCart(productId, quantity);

    // update quantity indicator using the fresh cart data
    let cartQuantity = 0;
    cart.forEach((item) => {
      cartQuantity += item.quantity;
    });
    const qtyEl = document.querySelector(".cart-quantity");
    if (qtyEl) {
      qtyEl.innerText = cartQuantity;
    }

    document
      .querySelector(`.added-to-cart-${productId}`)
      .classList.add("itemAdded");

    setTimeout(() => {
      document
        .querySelector(`.added-to-cart-${productId}`)
        .classList.remove("itemAdded");
    }, 10000);
  });
});
