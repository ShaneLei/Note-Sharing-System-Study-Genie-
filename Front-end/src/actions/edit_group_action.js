import axios from "axios";
import { BASE_URL } from "../properties";

const EDIT_GROUP_ENDPOINT = BASE_URL + "/edit_group";
export const EDIT_GROUP = "EDIT_GROUP";

export function editGroupAction(token, id, group_name, members, description) {
  var request = {
    _id: id,
    token: token,
    group_name: group_name,
    members: members,
    description: description
  };

  var response = axios.post(EDIT_GROUP_ENDPOINT, request);

  return {
    type: EDIT_GROUP,
    payload: response
  };
}

// Sample
// {
// 	"_id":"5bfb6995fb41c23e0acea458",
// 	"group_name": "group1",
// 	"members": "1,2",
// 	"description": "testing",
// 	"token": "QM2CLMLK7VIC8R4RDHNQ"

// }
