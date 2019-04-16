import {GET_NOTES} from '../actions/get_notes_action';

export default function (state = null, action) {

    switch (action.type) {
        case GET_NOTES:
            return action.payload.data;
    }

    return state;
}
