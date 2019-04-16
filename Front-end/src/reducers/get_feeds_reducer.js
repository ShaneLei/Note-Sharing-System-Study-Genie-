import {GET_FEEDS} from '../actions/get_feeds_action';

export default function (state = null, action) {

    switch (action.type) {
        case GET_FEEDS:
            return action.payload.data;
    }

    return state;
}
