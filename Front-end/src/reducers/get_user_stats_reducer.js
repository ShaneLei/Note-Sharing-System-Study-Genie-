import {GET_USER_STATS} from '../actions/get_user_stats_action';

export default function (state = null, action) {

    switch (action.type) {
        case GET_USER_STATS:
            return action.payload.data;
    }

    return state;
}
