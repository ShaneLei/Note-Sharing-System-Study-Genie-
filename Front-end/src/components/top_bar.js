import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";

import { logoutAction } from "../actions/authentication_action";
import { invalidateAction } from "../actions/invalidate_action";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  rightButton: {
    marginLeft: "auto"
  }
});

class TopBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.authentication &&
      this.props.authentication.response == "Logged out"
    ) {
      this.props.history.push("/login");
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Study Genie
            </Typography>

            <Button
              color="inherit"
              className={classes.rightButton}
              onClick={() => {
                this.props.logoutAction(this.props.authentication.token);
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { logoutAction: logoutAction, invalidateAction: invalidateAction }
  )(withStyles(styles)(TopBar))
);
