import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { getNotesAction } from "../actions/get_notes_action";
import NoteCard from "./note_card";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutAction } from "../actions/authentication_action";
import { getUserDetailsAction } from "../actions/get_user_details_action";
import { getUsersAction } from "../actions/get_users_action";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";

import AddNoteDialog from "./add_note_dialog";
import EditNoteDialog from "./edit_note_dialog";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import WordCloud from "./word_cloud";
import {getUserStatusAction} from "../actions/get_user_stats_action";

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
    height: 200,
    padding: 5
  },
  icon_add: {
    fontSize: 150
  },
  chip: {
    margin: 5
  }
});

class NotesLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddNoteDialog: false,
      showEditNoteDialog: false,
      showNoteDetailDialog: false,
      showingNote: null
    };
    this.showNotes = this.showNotes.bind(this);
    this.showAddNoteDialog = this.showAddNoteDialog.bind(this);
    this.dismissAddNoteDialog = this.dismissAddNoteDialog.bind(this);
    this.showNoteDetailDialog = this.showNoteDetailDialog.bind(this);
    this.dismissNoteDetailDialog = this.dismissNoteDetailDialog.bind(this);
    this.showEditNoteDialog = this.showEditNoteDialog.bind(this);
    this.dismissEditNoteDialog = this.dismissEditNoteDialog.bind(this);
  }

  componentDidMount() {
    if (this.props.authentication && this.props.location.pathname == "/notes") {
      this.props.getNotesAction(this.props.authentication.token, "", "");
      this.props.getUsersAction(this.props.authentication.token);
      this.props.getUserStatusAction(this.props.authentication.token);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.authentication &&
      this.props.authentication.response == "Logged out"
    ) {
      this.props.history.push("/login");
    }
  }

  showAddNoteDialog() {
    this.setState({
      showAddNoteDialog: true
    });
  }

  dismissAddNoteDialog() {
    this.setState({
      showAddNoteDialog: false
    });
    console.log("notes_layout - dismiss dialog!");

    // Every time the dialog is closed, we want to get notes list again.
      if(this.props.match.params.labelname){
          this.props.getNotesAction(this.props.authentication.token, this.props.match.params.labelname, '');
      }else{
          this.props.getNotesAction(this.props.authentication.token, '', '');
      }
    // Also update the left panel labels and groups.
    this.props.getUserDetailsAction(this.props.authentication.token);
    this.props.getUserStatusAction(this.props.authentication.token);
  }

  getAddNoteDialogVisibility() {
    return this.state.showAddNoteDialog;
  }

  showNoteDetailDialog(note) {
    this.setState({
      showNoteDetailDialog: true,
      showingNote: note
    });
    console.log(note.title);
  }

  dismissNoteDetailDialog() {
    this.setState({
      showNoteDetailDialog: false,
      showingNote: null
    });
  }

  getNoteDetailDialogVisibility() {
    return this.state.showNoteDetailDialog;
  }

  showEditNoteDialog(note) {
    this.setState({
      showEditNoteDialog: true,
      showingNote: note
    });
    console.log(note);
  }

  dismissEditNoteDialog() {
    this.setState({
      showEditNoteDialog: false,
      showingNote: null
    });

    // Every time the dialog is closed, we want to get notes list again.
      if(this.props.match.params.labelname){
          this.props.getNotesAction(this.props.authentication.token, this.props.match.params.labelname, '');
      }else{
          this.props.getNotesAction(this.props.authentication.token, '', '');
      }
    // Also update the left panel labels and groups.
    this.props.getUserDetailsAction(this.props.authentication.token);
    this.props.getUserStatusAction(this.props.authentication.token);
  }

  getEditNoteDialogVisibility() {
    return this.state.showEditNoteDialog;
  }

  showNotes() {
    if (this.props.getNotes && this.props.getNotes.notes.length > 0) {
      // Shows the "Add note (+)" card and the rest of the note cards.
      return (
        <Grid container spacing={24} style={{ width: "100%" }}>
            <Grid container spacing={24} alignItems="center"
                  justify="center"
                  direction="column">
            <Grid item xs={12}>
              <WordCloud/>
            </Grid>
            </Grid>
          <Grid item xs={4}>
            <Card
              className={this.props.classes.card}
              onClick={this.showAddNoteDialog}
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
          {this.props.getNotes.notes.map(note => (
            <Grid item xs={4} key={note["_id"]["$oid"]}>
              <NoteCard
                note={note}
                showNoteDetailDialog={this.showNoteDetailDialog.bind(
                  this,
                  note
                )}
                showEditNoteDialog={this.showEditNoteDialog.bind(this, note)}
              />
            </Grid>
          ))}
        </Grid>
      );
    } else {
      // Only show the "Add note (+)" card
      return (
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Card
              className={this.props.classes.card}
              onClick={this.showAddNoteDialog}
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
    const notes = this.showNotes();
    // var chips = this.state.showingNote.labels.map(label => (
    //   <Chip label={label} className={classes.chip} />
    // ));

    return (
      <div>
        <main className={classes.content}>
          <div className={classes.toolbar} />

          {notes}
        </main>

        <AddNoteDialog
          open={this.getAddNoteDialogVisibility()}
          dismissDialog={this.dismissAddNoteDialog}
          isShowingGroupNote={false}
        />

        <EditNoteDialog
          open={this.getEditNoteDialogVisibility()}
          dismissDialog={this.dismissEditNoteDialog}
          note={this.state.showingNote}
        />

        <Dialog
          open={this.getNoteDetailDialogVisibility()}
          onClose={this.dismissNoteDetailDialog}
          scroll="paper"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {this.state.showingNote && (
            <DialogTitle id="alert-dialog-title">
              {" "}
              {this.state.showingNote.title}{" "}
            </DialogTitle>
          )}
          <DialogContent>
            {this.state.showingNote && (
              <Typography variant="body1">
                {" "}
                {this.state.showingNote.note_content}{" "}
              </Typography>
            )}

            {this.state.showingNote &&
              this.state.showingNote.labels &&
              this.state.showingNote.labels
                .split(",")
                .map(label => <Chip label={label} className={classes.chip} />)}

            {/* TODO - Add some more fields of the note */}

            {/* <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous location data to
              Google, even when no apps are running.
            </DialogContentText> */}
          </DialogContent>
          {/* <DialogActions>
            <Button color="primary">
              Disagree
            </Button>
            <Button color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions> */}
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    getNotes: state.getNotes,
    addNote: state.addNote
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getNotesAction: getNotesAction,
      logoutAction: logoutAction,
      getUserDetailsAction: getUserDetailsAction,
      getUsersAction: getUsersAction,
        getUserStatusAction: getUserStatusAction
    }
  )(withStyles(styles)(NotesLayout))
);
