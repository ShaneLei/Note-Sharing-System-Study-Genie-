import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import red from "@material-ui/core/colors/red";
import Typography from "@material-ui/core/Typography";
import DetailsIcon from "@material-ui/icons/Details";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { connect } from "react-redux";
import { getGroupsAction } from "../actions/get_groups_action";
import { editGroupAction } from "../actions/edit_group_action";
import { CardActionArea } from "@material-ui/core";
import { getUserDetailsAction } from "../actions/get_user_details_action";

const styles = theme => ({
  card: {
    padding: 5,
    height: 250
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  iconHover: {
    margin: theme.spacing.unit * 1,
    "&:hover": {
      color: red[800],
      cursor: "pointer"
    }
  },
  myTextOverflow: {
    maxWidth: "90%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block"
  },
  media: {
    height: 110
  }
});

class GroupCard extends Component {
  constructor(props) {
    super(props);
  }

  getRandomNum() {
    return Math.floor(Math.random() * 1000);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.editGroup && prevProps.editGroup !== this.props.editGroup) {
      this.props.getGroupsAction(this.props.authentication.token);
      this.props.getUserDetailsAction(this.props.authentication.token);
    }
  }

  render() {
    const { classes } = this.props;
    const { group } = this.props;

    var displayContent = group.description.replace(/\n/g, " ").substring(0, 30);

    return (
      <Card className={classes.card}>
        <CardActionArea
          onClick={() => {
            this.props.showGroupDetailDialog(group);
          }}
        >
          <CardMedia
            className={classes.media}
            image={"https://picsum.photos/400/600/"}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              className={classes.myTextOverflow}
            >
              {group.group_name}
            </Typography>
            <Typography component="p" className={classes.myTextOverflow}>
              {displayContent}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <DetailsIcon
            className={classes.iconHover}
            onClick={() => {
              this.props.showGroupDetailDialog(group);
            }}
          />
          <GroupAddIcon
            className={classes.iconHover}
            onClick={() => {
              this.props.showAddMemberDialog(group);
            }}
          />
          <ExitToAppIcon
            className={classes.iconHover}
            onClick={() => {
              if (this.props.userDetails) {
                console.log(group);
                console.log(this.props.userDetails.user.userid);

                  let memberList = group.members;
                  let index = memberList.indexOf(this.props.userDetails.user.userid);
                  if (index !== -1) memberList.splice(index, 1);

                  let members = memberList.join();

                this.props.editGroupAction(
                  this.props.authentication.token,
                  group._id.$oid,
                  group.group_name,
                  members,
                  group.description
                );
              }
            }}
          />
        </CardActions>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    userDetails: state.userDetails,
    getGroups: state.getGroups,
    editGroup: state.editGroup
  };
}

export default connect(
  mapStateToProps,
  { getGroupsAction: getGroupsAction, editGroupAction: editGroupAction, getUserDetailsAction: getUserDetailsAction }
)(withStyles(styles)(GroupCard));
