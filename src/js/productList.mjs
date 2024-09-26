import { getProductsByCategory } from './externalServices.mjs';
import { renderListWithTemplate } from './utils.mjs';

export default function productList(selector, category) {
  const container = document.querySelector(selector);
  getProductsByCategory(category)
    .then((products) => {
      console.log(products);
      const filter = products.filter(filterProducts);
      renderListWithTemplate(productCardTemplate, container, filter);
    })
    .catch((error) => console.error(error));
}

function productCardTemplate(product) {
  const getDiscountPercent =
    100 - ((product.FinalPrice * 100) / product.SuggestedRetailPrice).toFixed(0);
  return `
    <li class="product-card">
      <a href="./product_pages/index.html?product=${product.Id}">
        <img class="product__image"
          src="${product.Images.PrimaryMedium}"
          alt="Image of ${product.Name}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <div class="product-header-info">
          <p class="product-card__price">$${product.FinalPrice}</p>
          <p class="discount-indicator"><span>- ${getDiscountPercent}%</span></p>
        </div>
        <p class="product-card__suggest">$${product.SuggestedRetailPrice}</p>
      </a>
    </li>
    `;
}

function filterProducts(product) {
  return product.FinalPrice != 179.99;
}

export function capitalizeWord(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}