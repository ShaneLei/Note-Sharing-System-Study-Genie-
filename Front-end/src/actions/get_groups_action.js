import axios from "axios";
import { BASE_URL } from "../properties";

const GET_GROUPS_ENDPOINT = BASE_URL + "/get_groups";
export const GET_GROUPS = "GET_GROUPS";

export function getGroupsAction(token) {
  var request = { token: token };

  var response = axios.post(GET_GROUPS_ENDPOINT, request);

  return {
    type: GET_GROUPS,
    payload: response
  };
}
