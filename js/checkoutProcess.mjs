import {
  getLocalStorage, alertMessage,
  removeAllAlerts,
} from './utils.mjs';
import { checkout } from "./externalServices.mjs";

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
  // convert the list of products from localStorage to the simpler form required for the checkout process. Array.map would be perfect for this.
  const listPackageItems = items.map((element) => {
    return {
      id: element.Id,
      name: element.Name,
      price: element.FinalPrice,
      quantity: element.Quantity
    }
  })
  return listPackageItems;
}
function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}
const checkoutProcess = {
  key: '',
  selector: '',
  list: [],
  itemTotal: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,
  init: function (key, selector) {
    this.key = key;
    this.selector = selector;
    this.list = getLocalStorage(key);
    console.log(this.list);
    this.calculateSummary();
    this.calculateOrderTotal();
    this.displayOrderSummary();
  },
  calculateSummary: function () {
    this.list.map((items) => {
      this.itemTotal += (items.FinalPrice * items.Quantity);
    });
    this.tax = (this.itemTotal * 0.06).toFixed(2);
    this.shipping = (this.list.length * 2 + 10 - 2).toFixed(2);
  },
  calculateOrderTotal: function () {
    this.orderTotal = (parseFloat(this.itemTotal) + parseFloat(this.tax) + parseFloat(this.shipping)).toFixed(2);
    this.displayOrderSummary();
  },
  displayOrderSummary: function () {
    const element = document.querySelector(this.selector);
    if (element) {
      element.innerHTML = `
        <div class="camp-order-summary">
            <p>Item Subtotal(${this.list.length})</p>
            <p>$${this.itemTotal.toFixed(2)}</p>
        </div>
        <div class="camp-order-summary">
            <p>Shipping Estimate</p>
            <p>$${this.shipping}</p>
        </div>
        <div class="camp-order-summary">
            <p>Tax</p>
            <p>$${this.tax}</p>
        </div>
        <div class="camp-order-summary">
            <p><strong>Order Total</strong></p>
            <p>$${this.orderTotal}</p>
        </div>
    `;
    }
  },
  checkout: async function (form) {
    try {
      // build the data object from the calculated fields, the items in the cart, and the information entered into the form
      // call the checkout method in our externalServices module and send it our data object.
      const json = formDataToJSON(form);
      // add totals, and item details
      json.orderDate = new Date();
      json.orderTotal = this.orderTotal;
      json.tax = this.tax;
      json.shipping = this.shipping;
      json.items = packageItems(this.list);
      console.log(json);
      try {
        const res = await checkout(json);
        this.success();
      } catch (err) {
        // get rid of any preexisting alerts.
        removeAllAlerts();
        for (let message in err.message) {
          alertMessage(err.message[message]);
         }
        console.log(err);
      }
    } catch (error) {
      console.log(error)
    }
  },
  success: function () {
    window.location.href = 'success.html'
    localStorage.clear()
  }
};

export default checkoutProcess;