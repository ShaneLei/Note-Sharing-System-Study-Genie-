import axios from 'axios';
import {BASE_URL} from '../properties';

const GET_USER_STATS_ENDPOINT = BASE_URL + '/user_stats';
export const GET_USER_STATS = 'GET_USER_STATS';

export function getUserStatusAction(token) {
    var request = {'token': token};

    var response = axios.post(GET_USER_STATS_ENDPOINT, request);

    return {
        type: GET_USER_STATS,
        payload: response
    };
}

