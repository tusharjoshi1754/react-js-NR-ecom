import { authenticationService } from '../services';
import * as Constant from "../constants/common";

export function authHeader() {
    // return authorization header with basic auth credentials
    let user = JSON.parse(localStorage.getItem(Constant.ADMIN_TOKEN));

    if (user && user.authdata) {
        return { 'Authorization': 'Basic ' + user.authdata };
    } else {
        return {};
    }
}