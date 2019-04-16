import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';

const PrivateRouteComponent = (props) => (
    <Route {...props.routeProps} render={() => (
        (props.authentication && props.authentication.token)  ? (
            <div>{props.children}</div>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} /> )
    )} />
);

const mapStateToProps = (state, ownProps) => {
    return {
        authentication: state.authentication,
        location: ownProps.path,
        routeProps: {
            exact: ownProps.exact,
            path: ownProps.path
        }
    };
};

const PrivateRoute = connect(mapStateToProps, null)(PrivateRouteComponent);
export default PrivateRoute
