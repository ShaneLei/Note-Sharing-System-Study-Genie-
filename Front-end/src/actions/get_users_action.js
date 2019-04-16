import axios from "axios";
import { BASE_URL } from "../properties";

const GET_USERS_ENDPOINT = BASE_URL + "/get_users";
export const GET_USERS = "GET_USERS";

export function getUsersAction(token) {
  var request = { token: token };

  var response = axios.post(GET_USERS_ENDPOINT, request);

  return {
    type: GET_USERS,
    payload: response
  };
}

/*

Sample
{
	"token": "2OQF2AA2LN8IQVUCWTJV"
}

*/
