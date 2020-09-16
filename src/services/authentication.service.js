import { BehaviorSubject } from 'rxjs';

import { handleResponse } from '../_helpers';

import * as Constant from '../constants/common';

import * as config from '../config.json';

const currentUserSubject = new BehaviorSubject(localStorage.getItem(Constant.ADMIN_TOKEN));

export const authenticationService = {
    login,
    forgotPassword,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserToken () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
    console.log("demo",requestOptions)
    const resourceURL = `${config.API_URL}${'adminusers/authenticate'}`
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(user => {
            localStorage.setItem(Constant.CURRENT_USERS, JSON.stringify(user.user[0]));
            localStorage.setItem(Constant.ADMIN_TOKEN, user.token);
            currentUserSubject.next(user.token);
            
            return user;
        });
}

function forgotPassword(email){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    };
    const resourceURL = `${config.API_URL}${'adminusers/forgotpass'}`
    return fetch(resourceURL, requestOptions)
        .then(handleResponse)
        .then(res =>{
            return res;
        })
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(Constant.ADMIN_TOKEN);
    localStorage.removeItem(Constant.CURRENT_USERS);
    currentUserSubject.next(null);
}
