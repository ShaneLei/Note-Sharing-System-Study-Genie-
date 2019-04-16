import { EDIT_NOTE } from '../actions/edit_note_action';

export default function (state = null, action) {

  switch (action.type) {
    case EDIT_NOTE:
      return action.payload.data;
  }

  return state;
}