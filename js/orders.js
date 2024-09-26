import { checkLogin, isTokenValid } from './auth.mjs';
import { getCurrentOrders } from './currentOrders.mjs';
import { getLocalStorage, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();


const token = getLocalStorage("so-token")
isTokenValid(token);
console.log(token);


getCurrentOrders('#orders', checkLogin());
