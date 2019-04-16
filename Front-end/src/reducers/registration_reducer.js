import {REGISTER_USER} from '../actions/registration_action';

export default function (state = null, action) {

    switch (action.type) {
        case REGISTER_USER:
            return action.payload.data;
    }

    return state;
}
