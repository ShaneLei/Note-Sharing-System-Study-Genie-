import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {loginAction} from "../actions/authentication_action";
import CircularProgress from '@material-ui/core/CircularProgress';
import '../.././style/login.css';
import { invalidateAction } from "../actions/invalidate_action";

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            submitted: false,
            showLoader: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showLoginErrors = this.showLoginErrors.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.componentDidUpdate.bind(this);
    }

    componentDidMount() {
        this.props.invalidateAction();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.authentication && this.props.authentication != prevProps.authentication && this.state.showLoader) {
            if (this.props.authentication.responsecode == '1') {
                this.props.history.push('/notes');
            }
            this.setState({showLoader: false});
        }
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {username, password} = this.state;
        if (username && password) {
            this.setState({showLoader: true});
            this.props.loginAction(username, password);
        }
    }

    showLoader() {
        if (this.state.showLoader) {
            return (
                <div className="my-spinner">
                    <CircularProgress size={45}/>
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }

    showLoginErrors() {
        if (this.props.authentication) {
            if (this.props.authentication.responsecode == '0') {
                return (
                    <div className="form-group has-danger">
                        <div className="text-help" style={{"color": "red"}}>{this.props.authentication.response}</div>
                    </div>
                );
            }
        } else {
            return (
                <div></div>
            );
        }
    }

    render() {
        // const { loggingIn } = this.props;
        const {username, password, submitted} = this.state;
        const error = this.showLoginErrors();
        const loader = this.showLoader();
        return (
            <div className="bootstrap-iso">
                <div className="jumbotron">
                    <div className="container">
                        <div className="col-sm-8 col-sm-offset-2">
                            <div className="container">
                                <form name="form" onSubmit={this.handleSubmit}>
                                    <div className="card card-container">

                                        <img id="profile-img" className="profile-img-card"
                                             src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"/>

                                        <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                                            <h2>SignIn</h2>
                                            <label htmlFor="username">Username</label>
                                            <input type="text" className="form-control" name="username" value={username}
                                                   onChange={this.handleChange}/>
                                            {submitted && !username &&
                                            <div className="help-block">Username is required</div>
                                            }
                                        </div>
                                        {loader}
                                        <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                                            <label htmlFor="password">Password</label>
                                            <input type="password" className="form-control" name="password"
                                                   value={password}
                                                   onChange={this.handleChange}/>
                                            {submitted && !password &&
                                            <div className="help-block">Password is required</div>
                                            }
                                        </div>
                                        {error}
                                        <div className="form-group">
                                            <button className="btn btn-primary">Login</button>

                                            <Link to="/register" className="btn btn-link">Register</Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    };
}

export default withRouter(connect(mapStateToProps, {loginAction: loginAction, invalidateAction: invalidateAction})(Login));

