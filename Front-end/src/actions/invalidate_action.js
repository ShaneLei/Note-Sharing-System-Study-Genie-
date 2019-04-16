import axios from 'axios';

export const INVALIDATE = 'INVALIDATE';

export function invalidateAction() {

    return {
        type: INVALIDATE,
        payload: null
    };
}

