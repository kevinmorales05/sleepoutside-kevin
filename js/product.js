import { getParam } from './utils.mjs';
import productDetails from './productDetails.mjs';

const idProduct = getParam('product');
productDetails(idProduct);


