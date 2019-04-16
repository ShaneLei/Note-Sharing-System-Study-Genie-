import { EDIT_GROUP } from "../actions/edit_group_action";

export default function(state = null, action) {
  switch (action.type) {
    case EDIT_GROUP:
      return action.payload.data;
  }

  return state;
}
