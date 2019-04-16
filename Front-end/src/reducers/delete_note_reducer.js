import {DELETE_NOTE} from '../actions/delete_note_action'

export default function (state = null, action) {

    switch (action.type) {
        case DELETE_NOTE:
            return action.payload.data;
    }

    return state;
}
