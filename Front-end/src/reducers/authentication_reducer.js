import {LOGIN_USER} from '../actions/authentication_action';
import {LOGOUT_USER} from '../actions/authentication_action';

export default function (state = null, action) {
    //console.log(action.type);
    //console.log(action.payload);

    switch (action.type) {
        case LOGIN_USER:
            return action.payload.data;
        case LOGOUT_USER:
            return action.payload.data;
    }

    return state;
}
