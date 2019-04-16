import { GET_GROUPS } from "../actions/get_groups_action";

export default function(state = null, action) {
  switch (action.type) {
    case GET_GROUPS:
      return action.payload.data;
  }

  return state;
}
