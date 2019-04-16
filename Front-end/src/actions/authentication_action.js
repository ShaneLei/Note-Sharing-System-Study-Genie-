import axios from 'axios';
import {BASE_URL} from '../properties';

const LOGIN_ENDPOINT = BASE_URL + '/login';
const LOGOUT_ENDPOINT = BASE_URL + '/logout';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export function loginAction(username, password) {
    var request = {'userid': username, 'password': password};
    var response = axios.post(LOGIN_ENDPOINT, request);

    return {
        type: LOGIN_USER,
        payload: response
    };
}

export function logoutAction(token) {
    var request = {'token': token};
    var response = axios.post(LOGOUT_ENDPOINT, request);

    return {
        type: LOGOUT_USER,
        payload: response
    };
}

