import axios from 'axios';
import { BASE_URL } from '../properties';

const GENERATE_CHEATSHEET_ENDPOINT = BASE_URL + '/auto_generate_note';
export const GENERATE_CHEATSHEET = 'GENERATE_CHEATSHEET';

export function generateCheatsheetAction(token, groupName) {
    var request = {'token': token, "group_name": groupName};

    var response = axios.post(GENERATE_CHEATSHEET_ENDPOINT, request);

    return {
        type: GENERATE_CHEATSHEET,
        payload: response
    };
};
