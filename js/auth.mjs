import jwt_decode from 'jwt-decode';
import { loginRequest } from './externalServices.mjs';
import { alertMessage, getLocalStorage, setLocalStorage } from './utils.mjs';


const tokenKey = 'so-token';

export async function login(creds, redirect = '/'){
    try {
        const token = await loginRequest(creds);
        console.log(token);
        setLocalStorage(tokenKey, token);
        window.location = redirect;
    } catch (err) {
        alertMessage(err.message.message);
    }
}

export function isTokenValid(token){
    if (token) {
        const decode_token = jwt_decode(token);
        const current_date = new Date();
        if (decode_token.exp * 1000 < current_date.getTime()) {
            console.log('token expired');
            return false;
        } else {
            console.log('valid token');
            return true;
        } 
    } else {
        return false;
    }
}

export function checkLogin(){
    const getToken = getLocalStorage('so-token');
    if (!isTokenValid(getToken)) {
        localStorage.removeItem(tokenKey);
        const location = window.location;
        console.log(location);
        window.location = `/login/index.html?redirect=${location.pathname}`;
    } else {
        return getToken;
    }
}