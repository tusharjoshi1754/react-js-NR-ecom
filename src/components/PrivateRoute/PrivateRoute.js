import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as Constant from '../../constants/common';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem(Constant.CURRENT_USERS) && localStorage.getItem(Constant.ADMIN_TOKEN)
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/auth/login', state: { from: props.location } }} />
    )} />
)