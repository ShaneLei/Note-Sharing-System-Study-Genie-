import { ADD_NOTE } from '../actions/add_note_action'

export default function (state = null, action) {

    switch (action.type) {
        case ADD_NOTE:
            return action.payload.data;
    }

    return state;
}
