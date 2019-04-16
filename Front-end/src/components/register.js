import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {registerAction} from "../actions/registration_action";
import CircularProgress from '@material-ui/core/CircularProgress';
import '../.././style/login.css';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                firstName: '',
                lastName: '',
                username: '',
                password: ''
            },
            submitted: false,
            showLoader: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showRegistrationErrors = this.showRegistrationErrors.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.register && this.props.register != prevProps.register && this.state.showLoader) {
            this.setState({showLoader: false});
        }
    }

    handleChange(event) {
        const {name, value} = event.target;
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({submitted: true});
        const {user} = this.state;
        if (user.firstName && user.lastName && user.username && user.password) {
            console.log('In');
            this.setState({showLoader: true});
            this.props.registerAction(user.firstName, user.lastName, user.username, user.password);
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

    showRegistrationErrors() {
        if (this.props.register) {
            if (this.props.register.responsecode == '0') {
                return (
                    <div className="form-group has-danger">
                        <div className="text-help" style={{"color": "red"}}>{this.props.register.response}</div>
                    </div>
                );
            }else{
                return (
                    <div className="form-group">
                        <div className="text-help" style={{"color": "green"}}>{this.props.register.response}</div>
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
        const {registering} = this.props;
        const {user, submitted} = this.state;
        const error = this.showRegistrationErrors();
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


                                        <div
                                            className={'form-group' + (submitted && !user.firstName ? ' has-error' : '')}>
                                            <label htmlFor="firstName">First Name</label>
                                            <input type="text" className="form-control" name="firstName"
                                                   value={user.firstName} onChange={this.handleChange}/>
                                            {submitted && !user.firstName &&
                                            <div className="help-block">First Name is required</div>
                                            }
                                        </div>
                                        <div
                                            className={'form-group' + (submitted && !user.lastName ? ' has-error' : '')}>
                                            <label htmlFor="lastName">Last Name</label>
                                            <input type="text" className="form-control" name="lastName"
                                                   value={user.lastName} onChange={this.handleChange}/>
                                            {submitted && !user.lastName &&
                                            <div className="help-block">Last Name is required</div>
                                            }
                                        </div>
                                        {loader}
                                        <div
                                            className={'form-group' + (submitted && !user.username ? ' has-error' : '')}>
                                            <label htmlFor="username">Username</label>
                                            <input type="text" className="form-control" name="username"
                                                   value={user.username} onChange={this.handleChange}/>
                                            {submitted && !user.username &&
                                            <div className="help-block">Username is required</div>
                                            }
                                        </div>
                                        <div
                                            className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
                                            <label htmlFor="password">Password</label>
                                            <input type="password" className="form-control" name="password"
                                                   value={user.password} onChange={this.handleChange}/>
                                            {submitted && !user.password &&
                                            <div className="help-block">Password is required</div>
                                            }
                                        </div>
                                        {error}

                                        <div className="form-group has-danger">
                                            <div className="text-help" style={{'color': 'grey', 'font-size': 'smaller'}}>
                                                We will be collecting and analyzing your login, notes, groups, likes data. We use it provide good recommendations and user experience to you. We promise not to expose your data and to never sell it for ad revenues.
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <button className="btn btn-primary">Register</button>

                                            <Link to="/login" className="btn btn-link">Cancel</Link>
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
        register: state.register
    };
}

export default withRouter(connect(mapStateToProps, {registerAction: registerAction})(Register));
