import {GET_USER_DETAILS} from '../actions/get_user_details_action';

export default function (state = null, action) {

    switch (action.type) {
        case GET_USER_DETAILS:
            return action.payload.data;
    }

    return state;
}
