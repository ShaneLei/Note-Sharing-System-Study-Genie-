import axios from 'axios';
import { BASE_URL } from '../properties';

const ADD_NOTE_ENDPOINT = BASE_URL + '/add_note';
export const ADD_NOTE = 'ADD_NOTE';

export function addNoteAction(title, visibility, note_content, labels, groups, token) {
    var request = {
      'title': title,
      'visibility': visibility,
      'note_content': note_content,
      'token': token,
      'labels': labels,
      'groups': groups
    };

    var response = axios.post(ADD_NOTE_ENDPOINT, request);

    return {
        type: ADD_NOTE,
        payload: response
    };
}

/*

Sample
{
	"title": "test",
	"visibility": "all",
	"note_content": "test",
	"labels": "label1,label2",
    "groups": "group1,group2",
	"token": "2OQF2AA2LN8IQVUCWTJV"
}

*/
