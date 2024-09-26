import { getLocalStorage, renderListWithTemplate } from './utils.mjs';

export default function shoppingCart() {
  const cartItems = getLocalStorage('so-cart');
  const selectorCart = document.querySelector('.product-list');
  if (cartItems.length == 0) {
    displayCheckout(cartItems);
  } else {
    displayCheckout(cartItems);
    renderListWithTemplate(cartItemTemplate, selectorCart, cartItems);
    renderTotalCart(cartItems);
    selectorCart.addEventListener('click', deleteProduct);
    selectorCart.addEventListener('change', updateQuantity);
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimarySmall}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: <input type="number" min="1" value="${item.Quantity}" class="quantity-input" data-id="${item.Id}"/></p>
  <p class="cart-card__price">$${(item.FinalPrice * item.Quantity).toFixed(2)}</p>
  <button class="deleteBtn" data-id="${
    item.Id
  }"><span class="xBtn"><img src="../public/images/trash.svg" alt="Icon Trash"/></span></button>
</li>`;
  return newItem;
}

function renderTotalCart(itemPrices) {
  let totalPrice = 0;
  itemPrices.forEach((item) => {
    totalPrice += item.FinalPrice * item.Quantity;
  });
  const getTotalPrice = document.querySelector('.cart-total');
  const hideDisplay = document.querySelector('.hide');
  if (itemPrices.length != 0) {
    hideDisplay.style.display = 'flex';
    displayCheckout(itemPrices);
  } else {
    displayCheckout(itemPrices);
    hideDisplay.style.display = 'none';
  }
  return (getTotalPrice.innerHTML = `Total: $ ${totalPrice.toFixed(2)}`);
}

function deleteProduct(event) {
  // Find the delete button that was clicked
  const deleteButton = event.target.closest('.deleteBtn');

  // Check if a delete button was found
  if (deleteButton) {
    // Retrieve the product id from the data-id attribute of the delete button
    const productId = deleteButton.dataset.id;

    // Get the current cart items from local storage
    let cartItems = getLocalStorage('so-cart');

    // Find the index of the product with the matching id
    const index = cartItems.findIndex((item) => item.Id === productId);

    // Check if the product was found in the cart
    if (index !== -1) {
      // Remove the product from the cartItems array
      cartItems.splice(index, 1);

      // Save the updated cartItems back to local storage
      localStorage.setItem('so-cart', JSON.stringify(cartItems));

      // Re-render the cart list with the updated cartItems
      const selectorCart = document.querySelector('.product-list');
      renderListWithTemplate(cartItemTemplate, selectorCart, cartItems);

      // Update the total cart price
      renderTotalCart(cartItems);
    }
  }
}

function updateQuantity(event) {
  const quantityInput = event.target;
  const productId = quantityInput.dataset.id;
  const newQuantity = parseInt(quantityInput.value);

  let cartItems = getLocalStorage('so-cart');
  const index = cartItems.findIndex((item) => item.Id === productId);

  if (index !== -1) {
    cartItems[index].Quantity = newQuantity;
    localStorage.setItem('so-cart', JSON.stringify(cartItems));
    const selectorCart = document.querySelector('.product-list');
    renderListWithTemplate(cartItemTemplate, selectorCart, cartItems);
    renderTotalCart(cartItems);
  }
}

function messageEmpty() {
  const selectorCart = document.querySelector('.products');
  let messageCartEmpty = document.createElement('div');
  messageCartEmpty.className = 'message_empty';
  messageCartEmpty.innerHTML = `
    <h3>You Cart is Empty</h3>
    <p>Please add products!!</p>
    <img class="empty_cart" src="../../images/carro.png" alt="Shopping cart Empty Image">
  `;
  selectorCart.appendChild(messageCartEmpty);
}

function displayCheckout(items) {
  const checkoutShow = document.querySelector('.checkout button');
  if (items != 0) {
    checkoutShow.style.display = 'block';
  } else {
    checkoutShow.style.display = 'none';
    messageEmpty();
  }
}