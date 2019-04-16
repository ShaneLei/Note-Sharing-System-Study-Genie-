import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import { getGroupsAction } from "../actions/get_groups_action";
import { getUserDetailsAction } from "../actions/get_user_details_action";
import { getUsersAction } from "../actions/get_users_action";

import CreateGroupDialog from "./create_group_dialog";
import AddMemberDialog from "./add_member_dialog";

import GroupCard from "./group_card";

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  content: {
    marginLeft: drawerWidth,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  rightButton: {
    marginLeft: "auto"
  },
  card: {
    height: 250,
    padding: 5
  },
  icon_add: {
    fontSize: 150
  }
});

class GroupsLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateGroupDialog: false,
      showGroupDetailDialog: false,
      showAddMemberDialog: false,
      showingGroup: null
    };
    this.showGroups = this.showGroups.bind(this);
    this.showCreateGroupDialog = this.showCreateGroupDialog.bind(this);
    this.dismissCreateGroupDialog = this.dismissCreateGroupDialog.bind(this);
    this.showGroupDetailDialog = this.showGroupDetailDialog.bind(this);
    this.dismissGroupDetailDialog = this.dismissGroupDetailDialog.bind(this);
    this.showAddMemberDialog = this.showAddMemberDialog.bind(this);
    this.dismissAddMemberDialog = this.dismissAddMemberDialog.bind(this);
  }

  componentDidMount() {
    if (this.props.authentication) {
      this.props.getGroupsAction(this.props.authentication.token);
      this.props.getUsersAction(this.props.authentication.token);
      this.props.getUserDetailsAction(this.props.authentication.token);
      console.log(this.props.getUsers);
    }
  }

  showCreateGroupDialog() {
    this.setState({
      showCreateGroupDialog: true
    });
  }

  getCreateGroupDialogVisibility() {
    return this.state.showCreateGroupDialog;
  }

  dismissCreateGroupDialog() {
    this.setState({
      showCreateGroupDialog: false
    });
    console.log("groups_layout - dismiss dialog!");

    // Every time the dialog is closed, we want to get notes list again.
    this.props.getGroupsAction(this.props.authentication.token);
    // Also update the left panel labels and groups.
    this.props.getUserDetailsAction(this.props.authentication.token);
  }

  showGroupDetailDialog(group) {
    this.setState({
      showGroupDetailDialog: true,
      showingGroup: group
    });
    console.log(this.state.showingGroup);
  }

  getGroupDetailDialogVisibility() {
    return this.state.showGroupDetailDialog;
  }

  dismissGroupDetailDialog() {
    this.setState({
      showGroupDetailDialog: false,
      showingGroup: null
    });
  }

  showAddMemberDialog(group) {
    console.log(group._id);
    this.setState({
      showAddMemberDialog: true,
      showingGroup: group
    });
    console.log(this.state.showingGroup);
  }

  getAddMemberDialogVisibility() {
    console.log(
      "get add member dialog visibility" + this.state.showAddMemberDialog
    );
    return this.state.showAddMemberDialog;
  }

  dismissAddMemberDialog() {
    this.setState({
      showAddMemberDialog: false,
      showingGroup: null
    });
  }

  showGroups() {
    if (this.props.getGroups && this.props.getGroups.groups.length > 0) {
      // Shows the "Create group (+)" card and the rest of the note cards.
      return (
        <Grid container spacing={24} style={{ width: "100%" }}>
          <Grid item xs={3}>
            <Card
              className={this.props.classes.card}
              onClick={this.showCreateGroupDialog}
            >
              <CardActions style={{ justifyContent: "center" }}>
                <Icon
                  className={this.props.classes.icon_add}
                  color="action"
                  style={{ justifyContent: "center" }}
                >
                  add
                </Icon>
              </CardActions>
            </Card>
          </Grid>{" "}
          {this.props.getGroups.groups.map(group => (
            <Grid item xs={3} key={group["_id"]["$oid"]}>
              <GroupCard
                group={group}
                showGroupDetailDialog={this.showGroupDetailDialog.bind(
                  this,
                  group
                )}
                showAddMemberDialog={this.showAddMemberDialog.bind(this, group)}
              />
            </Grid>
          ))}
        </Grid>
      );
    } else {
      // Only show the "Create group (+)" card
      return (
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <Card
              className={this.props.classes.card}
              onClick={this.showCreateGroupDialog}
            >
              <CardActions style={{ justifyContent: "center" }}>
                <Icon
                  className={this.props.classes.icon_add}
                  color="action"
                  style={{ justifyContent: "center" }}
                >
                  add
                </Icon>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      );
    }
  }

  render() {
    const { classes } = this.props;
    const groups = this.showGroups();

    return (
      <div>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {groups}
        </main>

        <CreateGroupDialog
          open={this.getCreateGroupDialogVisibility()}
          dismissDialog={this.dismissCreateGroupDialog}
        />

        <Dialog
          open={this.getGroupDetailDialogVisibility()}
          onClose={this.dismissGroupDetailDialog}
          scroll="paper"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {this.state.showingGroup && (
            <DialogTitle id="alert-dialog-group-name">
              {" "}
              {this.state.showingGroup.group_name}{" "}
            </DialogTitle>
          )}
          <DialogContent>
            {this.state.showingGroup && (
              <Typography variant="body1">
                {" "}
                {this.state.showingGroup.description}{" "}
              </Typography>
            )}
          </DialogContent>
        </Dialog>

        <AddMemberDialog
          open={this.getAddMemberDialogVisibility()}
          dismissDialog={this.dismissAddMemberDialog}
          group={this.state.showingGroup}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    getGroups: state.getGroups,
    getUsers: state.getUsers,
    userDetails: state.userDetails
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getGroupsAction: getGroupsAction,
      getUserDetailsAction: getUserDetailsAction,
      getUsersAction: getUsersAction
    }
  )(withStyles(styles)(GroupsLayout))
);
