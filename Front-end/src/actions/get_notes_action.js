import axios from 'axios';
import {BASE_URL} from '../properties';

const GET_NOTES_ENDPOINT = BASE_URL + '/get_notes';
export const GET_NOTES = 'GET_NOTES';

export function getNotesAction(token, label, group) {
    var request = {'token': token};
    if (label) {
        request['labels'] = label;
    }
    if (group) {
        request['groups'] = group;
    }
    var response = axios.post(GET_NOTES_ENDPOINT, request);

    return {
        type: GET_NOTES,
        payload: response
    };
}

