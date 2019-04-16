import axios from 'axios';
import { BASE_URL } from '../properties';

const EDIT_NOTE_ENDPOINT = BASE_URL + '/edit_note';
export const EDIT_NOTE = 'EDIT_NOTE';

export function editNoteAction(token, id, newTitle, newContent, newVisibility, newLabels, newGroups) {
  var request = {
    '_id': id,
    'token': token,
    'title': newTitle,
    'visibility': newVisibility,
    'note_content': newContent,
    'labels': newLabels,
    'groups': newGroups
  };

  var response = axios.post(EDIT_NOTE_ENDPOINT, request);

  return {
    type: EDIT_NOTE,
    payload: response
  };
}
