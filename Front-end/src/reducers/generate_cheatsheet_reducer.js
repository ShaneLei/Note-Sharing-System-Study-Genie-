import { GENERATE_CHEATSHEET } from '../actions/generate_cheatsheet_action';

export default function (state = null, action) {

    switch (action.type) {
        case GENERATE_CHEATSHEET:
            return action.payload.data;
    }

    return state;
};
