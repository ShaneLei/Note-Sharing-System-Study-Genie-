import axios from 'axios';
import {BASE_URL} from '../properties';

const DELETE_NOTE_ENDPOINT = BASE_URL + '/delete_note';
export const DELETE_NOTE = 'DELETE_NOTE';

export function deleteNoteAction(token, id) {
    var request = {'token': token, '_id': id};

    var response = axios.post(DELETE_NOTE_ENDPOINT, request);

    return {
        type: DELETE_NOTE,
        payload: response
    };
}

