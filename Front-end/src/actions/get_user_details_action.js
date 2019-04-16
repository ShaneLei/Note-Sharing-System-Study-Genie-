import axios from 'axios';
import {BASE_URL} from '../properties';

const GET_USER_DETAILS_ENDPOINT = BASE_URL + '/get_user';
export const GET_USER_DETAILS = 'GET_USER_DETAILS';

export function getUserDetailsAction(token) {
    var request = {'token': token};

    var response = axios.post(GET_USER_DETAILS_ENDPOINT, request);

    return {
        type: GET_USER_DETAILS,
        payload: response
    };
}

