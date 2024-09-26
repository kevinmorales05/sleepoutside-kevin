import { getOrders } from "./externalServices.mjs";

export async function getCurrentOrders(selector, token){
    try {
        const orders = await getOrders(token);
        const parent = document.querySelector(`${selector} tbody`);
        parent.innerHTML = orders.map(orderTemplate).join("");
    } catch (error) {
        console.log(error);   
    }
}

function orderTemplate(order) {
    return `
        <tr><td>${order.id}</td>
        <td>${new Date(order.orderDate).toLocaleDateString("en-US")}</td>
        <td>${order.items.length}</td>
        <td>${order.orderTotal}</td></tr>
    `;
}