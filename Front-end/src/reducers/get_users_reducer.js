import { GET_USERS } from "../actions/get_users_action";

export default function(state = null, action) {
  switch (action.type) {
    case GET_USERS:
      return action.payload.data;
  }

  return state;
}
