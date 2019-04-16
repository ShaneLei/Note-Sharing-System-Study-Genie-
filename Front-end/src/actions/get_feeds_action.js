import axios from 'axios';
import {BASE_URL} from '../properties';

const GET_FEEDS_ENDPOINT = BASE_URL + '/feed';
export const GET_FEEDS = 'GET_FEEDS';

export function getFeedsAction(token) {
    var request = {'token': token};

    var response = axios.post(GET_FEEDS_ENDPOINT, request);

    return {
        type: GET_FEEDS,
        payload: response
    };
}

