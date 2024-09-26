const baseURL = 'http://server-nodejs.cit.byui.edu:3000/'
async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: 'servicesError', message: data };
  }
}
export function getProductsByCategory(category) {
  return fetch(`${baseURL}products/search/${category}`)
    .then(convertToJson)
    .then((data) => data.Result);
}

export async function findProductById(id) {
  return fetch(`${baseURL}product/${id}`)
    .then(convertToJson)
    .then((data) => data.Result);
}

export async function checkout(payload) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  };
  return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
}

export async function loginRequest(creds){
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  };
  const response = await fetch(`${baseURL}login`, options).then(convertToJson);
  return response.accessToken;
}

export async function getOrders(token){
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`${baseURL}orders`, options).then(convertToJson);
  return response;
}