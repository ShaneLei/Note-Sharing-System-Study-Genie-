import {GET_GROUP_STATS} from '../actions/get_group_stats_action';

export default function (state = null, action) {

    switch (action.type) {
        case GET_GROUP_STATS:
            return action.payload.data;
    }

    return state;
}
