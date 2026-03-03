import {
  loadCartFromStorage,
  removeProductFromCart,
  saveCart,
  deliveryOptions,
  getDeliveryDate,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

// don't keep a separate copy; always call loadCartFromStorage() when you need the
// current contents.  The previous `cartDeleteIt` and imported `cart` were
// different instances and led to stale data.

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createCartProductCard);
  } else {
    createCartProductCard();
  }
}

function createCartProductCard() {
  const productsHTML = document.querySelector(".order-summary");
  console.log("Inside createCartProductCard");
  if (!productsHTML) return; // nothing to fill on this page

  productsHTML.innerHTML = "";

  // build lookup map instead of nested loops
  const productMap = new Map(products.map((p) => [p.id, p]));
  // console.log("Product map ", productMap);

  const cart = loadCartFromStorage();
  cart.forEach((cartItem) => {
    const product = productMap.get(cartItem.productId);
    if (!product) return; // inside for each loop return is used instead of continue

    // build dynamic delivery options for this cart item
    const deliveryOptionsHTML = deliveryOptions
      .map((option) => {
        const deliveryDate = getDeliveryDate(option.deliveryDays);
        const isChecked =
          cartItem.deliveryOptionId !== undefined
            ? cartItem.deliveryOptionId === option.id
              ? "checked"
              : ""
            : option.id === deliveryOptions[0].id
              ? "checked"
              : "";
        return `
          <div class="delivery-option">
            <input
              type="radio"
              ${isChecked}
              class="delivery-option-input"
              name="delivery-option-${cartItem.productId}"
              data-delivery-option-id="${option.id}"
              data-product-id="${cartItem.productId}"
            />
            <div>
              <div class="delivery-option-date">${deliveryDate}</div>
              <div class="delivery-option-price">${option.priceLabel}</div>
            </div>
          </div>
        `;
      })
      .join("");

    // compute current deliveryDate display, falling back to first option
    const currentDeliveryDate =
      cartItem.deliveryDate || getDeliveryDate(deliveryOptions[0].deliveryDays);

    const cartItemContainer = `<div class="cart-item-container" data-product-id = "${product.id}">
            <div class="delivery-date">Delivery date: ${currentDeliveryDate}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${product.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${product.name}
                </div>
                <div class="product-price">$${formatCurrency(product.priceCents)}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label" data-product-id = "${product.id}" data-quantity-of = "${product.id}">${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link link-primary"  data-product-id = "${product.id}">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary " data-product-id = "${product.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options" data-product-id ="${cartItem.productId}">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML}
              </div>
            </div>
          </div>`;

    productsHTML.insertAdjacentHTML("beforeend", cartItemContainer);
  });
}

document.body.addEventListener("click", allEvent);
document.body.addEventListener("change", (event) => {
  const deliveryInput = event.target.closest(".delivery-option-input");
  if (deliveryInput) {
    const productId = deliveryInput.dataset.productId;
    const deliveryOptionId = parseInt(deliveryInput.dataset.deliveryOptionId);
    const selectedOption = deliveryOptions.find(
      (o) => o.id === deliveryOptionId,
    );

    if (selectedOption) {
      const deliveryDate = getDeliveryDate(selectedOption.deliveryDays);
      handleDeliveryOption(
        productId,
        deliveryOptionId,
        deliveryDate,
        selectedOption.priceCents,
      );
    }
  }
});

const handleDelete = (productId) => {
  // console.log(productId, " this is handle delete");
  removeProductFromCart(productId);
  createCartProductCard();
};

const handleUpdate = (productId) => {
  console.log(productId, " this is handle update");
};

// document.querySelectorAll(".delete-quantity-link").forEach((btn) => {
//   btn.addEventListener("click", handleDelete);
// });

// document.querySelectorAll(".update-quantity-link").forEach((btn) => {
//   btn.addEventListener("click", handleUpdate);
// });

document.body.addEventListener("click", allEvent);

function allEvent(event) {
  const updateBtn = event.target.closest(".update-quantity-link");
  const deleteBtn = event.target.closest(".delete-quantity-link");

  if (updateBtn) {
    const productId = updateBtn.dataset.productId;
    const cartItemContainer = deleteBtn.closest(".cart-item-container");
    console.log("cartItemContainer ", cartItemContainer);
    const updateQuantity = parseInt(
      cartItemContainer.querySelector(".quantity-label").innerText,
    );

    handleUpdate(productId);
  }

  if (deleteBtn) {
    const productId = deleteBtn.dataset.productId;
    const cartItemContainer = deleteBtn.closest(".cart-item-container");
    // console.log("cartItemContainer ", cartItemContainer);
    const deleteQuantity = parseInt(
      cartItemContainer.querySelector(".quantity-label").innerText,
    );

    // console.log("To delete Quantity ", deleteQuantity);
    handleDelete(productId);
  }
}

function handleDeliveryOption(productId, optionId, date, priceCents) {
  console.log(
    `Delivery option changed for ${productId} (option ${optionId}): ${date}, $${formatCurrency(priceCents)}`,
  );

  const cart = loadCartFromStorage();
  const item = cart.find((c) => String(c.productId) === productId);
  if (!item) {
    console.warn(`Product ${productId} not found in cart`);
    return;
  }

  // update stored info
  item.deliveryOptionId = optionId;
  item.deliveryDate = date;
  item.deliveryPrice = priceCents;
  saveCart(cart);

  // update only the affected DOM element
  const container = document.querySelector(`[data-product-id="${productId}"]`);
  if (container) {
    const dateElem = container.querySelector(".delivery-date");
    if (dateElem) {
      dateElem.textContent = `Delivery date: ${date}`;
    }
  }
}
