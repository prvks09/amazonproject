let productsHTML = '';

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
      src="images/ratings/rating-${product.rating.stars*10}.png"
    />
    <div class="product-rating-count link-primary">${product.rating.count}</div>
  </div>

  <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>

  <div class="product-quantity-container">
    <select>
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

  <div class="added-to-cart">
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
document.querySelector('.js-products-grid').innerHTML += productsHTML;  // Use this or below recommended

/*
const container = document.querySelector('.js-products-grid'); //refer 10:31
container.insertAdjacentHTML('beforeend', productsHTML);
*/

document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
  button.addEventListener('click', () => {
    
    const productId = button.dataset.productId;
    // const productName = button.dataset.productName;
    // cart.push({
    //   productName,
    //   quantity: 1,
    
    // });

    console.log("button clicked",productId);

    let matchingItem;

    cart.forEach((item) => {
      console.log("Inside for each");

      if(productId === item.productId){
        matchingItem = item;
      }

    });

     if(matchingItem) {
        console.log("matching item Adding Quantity");
        matchingItem.quantity += 1;
      } else {
         console.log("NO matching item Adding Product + Quantity");

        console.log("pushing new item");

        cart.push(
          {
            productId: productId,
            // productName: productName,
            quantity: 1
          }

        );
      }


    console.log(cart);
  });



});



// .addEventListener('click', () => {

//   document.querySelector('.cart-quantity').Tex += 1;

//   document.querySelector('.product-quantity-container')




// });