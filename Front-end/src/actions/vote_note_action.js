import axios from 'axios';
import {BASE_URL} from '../properties';

const VOTE_NOTE_ENDPOINT = BASE_URL + '/vote_note';
export const VOTE_NOTE = 'VOTE_NOTE';

export function voteNoteAction(token, id, likeStatus) {
    var request = {'token': token, '_id': id, 'like_status': likeStatus};

    var response = axios.post(VOTE_NOTE_ENDPOINT, request);

    return {
        type: VOTE_NOTE,
        payload: response
    };
}

