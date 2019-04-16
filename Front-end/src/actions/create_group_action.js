import axios from "axios";
import { BASE_URL } from "../properties";

const CREATE_GROUP_ENDPOINT = BASE_URL + "/create_group";
export const CREATE_GROUP = "CREATE_GROUP";

export function createGroupAction(group_name, members, description, token) {
  var request = {
    group_name: group_name,
    members: members,
    description: description,
    token: token
  };

  var response = axios.post(CREATE_GROUP_ENDPOINT, request);

  return {
    type: CREATE_GROUP,
    payload: response
  };
}

/*

Sample
{
	"group_name": "group1",
	"members": "3",
	"description": "testing",
	"token": "85TBSY83PPG8BR2XBGOY"
}

*/
