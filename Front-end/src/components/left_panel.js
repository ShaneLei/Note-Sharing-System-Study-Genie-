import React, {Component, Fragment} from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import NotesIcon from "@material-ui/icons/Notes";
import FeedsIcon from "@material-ui/icons/RssFeed";
import LabelIcon from "@material-ui/icons/Label";
import GroupIcon from "@material-ui/icons/Group";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import SettingsIcon from "@material-ui/icons/Settings";
import PieChartIcon from "@material-ui/icons/PieChart";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getUserDetailsAction } from "../actions/get_user_details_action";
import { getNotesAction } from "../actions/get_notes_action";
import {getGroupStatsAction} from "../actions/get_group_stats_action";

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  link: {
    textDecoration: "none"
  },
  appName: {
    padding: theme.spacing.unit * 2,
    textAlign: "center"
  }
});

class LeftPanel extends Component {
  constructor(props) {
    super(props);
    this.getNoteLabels = this.getNoteLabels.bind(this);
    this.getNoteGroups = this.getNoteGroups.bind(this);
    this.showWelcomeMessage = this.showWelcomeMessage.bind(this);
  }

  componentDidMount() {
    this.props.getUserDetailsAction(this.props.authentication.token);
  }

  getNoteLabels() {
    if (this.props.userDetails) {
      return this.props.userDetails.user.labels.map((text, index) => (
        <Link to={"/labels/" + text} style={{ textDecoration: "none" }}>
          <ListItem
            button
            key={text}
            onClick={() => {
              this.props.getNotesAction(
                this.props.authentication.token,
                text,
                ""
              );
            }}
          >
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        </Link>
      ));
    } else {
      return <div />;
    }
  }

  getNoteGroups() {
    if (this.props.userDetails) {
      return this.props.userDetails.user.groups.map((text, index) => (
        <Link to={"/groups/" + text} style={{ textDecoration: "none" }}>
          <ListItem
            button
            key={text}
            onClick={() => {
              this.props.getNotesAction(
                this.props.authentication.token,
                "",
                text
              );
                this.props.getGroupStatsAction(this.props.authentication.token, text);

            }}
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        </Link>
      ));
    } else {
      return <div />;
    }
  }

  showWelcomeMessage(classes){
      if(this.props.userDetails){
          return (
              <Typography
                  variant="h6"
                  color="inherit"
                  className={classes.appName}
              >
                  Welcome {this.props.userDetails.user.userid}
              </Typography>
          );
      }else{
          return <Fragment></Fragment>;
      }
  }

  render() {
    const { classes } = this.props;
    const labels = this.getNoteLabels();
    const groups = this.getNoteGroups();
    const welcomeMessage = this.showWelcomeMessage(classes);
    return (
      <div>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
          anchor="left"
        >
          <div className={classes.toolbar}>
                {welcomeMessage}
          </div>
          <Divider />
          <List>
            <Link to="/notes" className={classes.link}>
              <ListItem button key={"Notes"}>
                <ListItemIcon>
                  <NotesIcon />
                </ListItemIcon>
                <ListItemText primary={"Notes"} />
              </ListItem>
            </Link>
            <Link to="/feeds" className={classes.link}>
              <ListItem button key={"Feeds"}>
                <ListItemIcon>
                  <FeedsIcon />
                </ListItemIcon>
                <ListItemText primary={"Feeds"} />
              </ListItem>
            </Link>
          <Link to="/visualize" className={classes.link}>
              <ListItem button key={"Visualize"}>
                  <ListItemIcon>
                      <PieChartIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Visualize"} />
              </ListItem>
          </Link>
          </List>
          <Divider />
          <List>
            <ListSubheader>Labels</ListSubheader>
            {labels}
          </List>
          <Divider />
          <List>
            <ListSubheader>Groups</ListSubheader>
            <Link to="/groups_overview" className={classes.link}>
              <ListItem button key={"Overview"}>
                <ListItemIcon>
                  <GroupWorkIcon />
                </ListItemIcon>
                <ListItemText primary={"Overview"} />
              </ListItem>
            </Link>
            {groups}
          </List>
          <Divider />
          <List>
            <ListItem button key={"Settings"}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={"Settings"} />
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    userDetails: state.userDetails
  };
}

export default connect(
  mapStateToProps,
  { getUserDetailsAction: getUserDetailsAction, getNotesAction: getNotesAction, getGroupStatsAction: getGroupStatsAction }
)(withStyles(styles)(LeftPanel));
