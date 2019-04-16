import axios from "axios";
import { BASE_URL } from "../properties";

const REGISTER_ENDPOINT = BASE_URL + "/register";
export const REGISTER_USER = "REGISTER_USER";

export function registerAction(firstname, lastname, username, password) {
    //TODO send firstname and lastname in request.
    var request = {
        firstname: firstname,
        lastname: lastname,
        userid: username,
        password: password
    };
    var response = axios.post(REGISTER_ENDPOINT, request);

    return {
        type: REGISTER_USER,
        payload: response
    };
}
