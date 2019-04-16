import axios from 'axios';
import {BASE_URL} from '../properties';

const GET_GROUP_STATS_ENDPOINT = BASE_URL + '/group_stats';
export const GET_GROUP_STATS = 'GET_GROUP_STATS';

export function getGroupStatsAction(token, groupName) {
    var request = {'token': token, 'group_name': groupName};

    var response = axios.post(GET_GROUP_STATS_ENDPOINT, request);

    return {
        type: GET_GROUP_STATS,
        payload: response
    };
}

