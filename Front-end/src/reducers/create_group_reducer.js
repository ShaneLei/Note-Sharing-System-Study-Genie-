import { CREATE_GROUP } from "../actions/create_group_action";

export default function(state = null, action) {
  switch (action.type) {
    case CREATE_GROUP:
      return action.payload.data;
  }

  return state;
}
