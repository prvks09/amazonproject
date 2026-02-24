import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";

function createDiv(classes, text = "") {
  const div = document.createElement("div");
  div.classList.add(...[].concat(classes));
  if (text) div.textContent = text;
  return div;
}

function createImg(classes, src, alt = "") {
  const img = document.createElement("img");
  img.classList.add(...[].concat(classes));
  img.src = src;
  img.alt = alt;
  return img;
}

function loadQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector(".cart-quantity").innerText = cartQuantity;
}

// --- Product Card Builder ---

function createProductCard(product) {
  const productContainer = document.createElement("div");

  // Image
  productContainer.className = "product-container";
  const imageContainer = document.createElement("div");
  imageContainer.className = "product-image-container";
  const img = document.createElement("img");
  img.className = "product-image";
  img.src = product.image;
  img.alt = product.name;
  imageContainer.appendChild(img);
  productContainer.appendChild(imageContainer);

  // Name
  const productName = document.createElement("div");
  productName.classList.add("product-name", "limit-text-to-2-lines");
  productName.textContent = product.name;
  productContainer.appendChild(productName);

  // Rating
  const productRatingContainer = document.createElement("div");
  productRatingContainer.classList.add("product-rating-container");
  const ratingStar = document.createElement("img");
  ratingStar.classList.add("product-rating-stars");
  ratingStar.src = `images/ratings/rating-${product.rating.stars * 10}.png`;
  ratingStar.alt = `${product.rating.stars} stars`;
  const ratingCount = document.createElement("div");
  ratingCount.classList.add("product-rating-count", "link-primary");
  ratingCount.textContent = product.rating.count;
  productRatingContainer.append(ratingStar, ratingCount);
  productContainer.appendChild(productRatingContainer);

  // Price

  const productPriceContainer = document.createElement("div");
  productPriceContainer.classList.add("product-price");
  productPriceContainer.innerText = `$${(product.priceCents / 100).toFixed(2)}`;
  productContainer.appendChild(productPriceContainer);

  // Quantity Selector
  const productQuantityContainer = document.createElement("div");
  productQuantityContainer.classList.add(
    "product-quantity-container",
    `product-quantity-container-${product.id}`,
  );

  const selectQuantity = document.createElement("select");
  selectQuantity.classList.add(
    "select-quantity",
    `select-quantity-${product.id}`,
  );
  selectQuantity.name = "quantity-selection";

  for (let i = 1; i <= 10; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    if (i === 1) {
      option.selected = true;
    }
    selectQuantity.append(option);
  }

  productQuantityContainer.append(selectQuantity);
  productContainer.append(productQuantityContainer);

  // Spacer
  const productSpacer = document.createElement("div");
  productSpacer.classList.add("product-spacer");
  productContainer.append(productSpacer);

  // Added to Cart Feedback
  const addedToCart = document.createElement("div");
  addedToCart.classList.add("added-to-cart", `added-to-cart-${product.id}`);
  const imgCheckBox = document.createElement("img");
  imgCheckBox.src = "images/icons/checkmark.png";
  imgCheckBox.alt = "Added to cart checkmark";
  addedToCart.append(imgCheckBox, "Added to Cart");
  productContainer.append(addedToCart);

  // Add to Cart Button
  const addToCartButton = document.createElement("button");
  addToCartButton.classList.add(
    "add-to-cart-button",
    "js-add-to-cart-button",
    "button-primary",
  );

  addToCartButton.dataset.productName = product.name;
  addToCartButton.dataset.productId = product.id;
  addToCartButton.innerText = "Add to Cart";
  addToCartButton.addEventListener("click", (event) => {
    const btn = event.currentTarget;

    const { productName, productId } = btn.dataset;
    const parentContainer = btn.closest(".product-container");
    const selectedQuantity = parseInt(
      parentContainer.querySelector("select").value,
    );

    addToCart(productId, selectedQuantity);
    // loadQuantity();

    const addedToCartEl = parentContainer.querySelector(".added-to-cart");

    addedToCartEl.classList.add("itemAdded");

    if (btn.timerId) {
      clearTimeout(btn.timerId);
    }

    btn.timerId = setTimeout(() => {
      addedToCartEl.classList.remove("itemAdded");
      btn.timerId = null;
    }, 3000);
  });

  productContainer.append(addToCartButton);

  return productContainer;
}

// --- Load Products ---
function loadProducts() {
  loadQuantity();
  const productsGridEl = document.querySelector(".js-products-grid");
  productsGridEl.innerHTML = ""; // clear before loading
  products.forEach((product) => {
    const card = createProductCard(product);
    productsGridEl.appendChild(card);
  });
}

loadProducts();
