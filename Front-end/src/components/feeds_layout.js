import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { getFeedsAction } from "../actions/get_feeds_action";
import NoteCard from "./note_card";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUserDetailsAction } from "../actions/get_user_details_action";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import EditNoteDialog from "./edit_note_dialog";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

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
    }
});

class FeedsLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditNoteDialog: false,
            showNoteDetailDialog: false,
            showingNote: null
        };
        this.showNotes = this.showNotes.bind(this);
        this.showNoteDetailDialog = this.showNoteDetailDialog.bind(this);
        this.dismissNoteDetailDialog = this.dismissNoteDetailDialog.bind(this);
        this.showEditNoteDialog = this.showEditNoteDialog.bind(this);
        this.dismissEditNoteDialog = this.dismissEditNoteDialog.bind(this);
    }

    componentDidMount() {
        if (this.props.authentication && this.props.location.pathname == '/feeds') {
            this.props.getFeedsAction(this.props.authentication.token);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

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
            showingNote: note,
        });
        console.log(note);
    }

    dismissEditNoteDialog() {
        this.setState({
            showEditNoteDialog: false,
            showingNote: null,
        });

        // Every time the dialog is closed, we want to get notes list again.
        this.props.getFeedsAction(this.props.authentication.token, "", "");
    }

    getEditNoteDialogVisibility() {
        return this.state.showEditNoteDialog;
    }

    showNotes() {
        if (this.props.feeds && this.props.feeds.notes.length > 0) {
            return (
                <Grid container spacing={24} style={{ width: "100%" }}>
                    {this.props.feeds.notes.map(note => (
                        <Grid item xs={4} key={note["_id"]["$oid"]}>
                            <NoteCard
                                note={note}
                                showNoteDetailDialog={this.showNoteDetailDialog.bind(this, note)}
                                showEditNoteDialog={this.showEditNoteDialog.bind(this, note)}
                            />
                        </Grid>
                    ))}
                </Grid>
            );
        } else {
            // Only show No Feeds
            return (
                <Grid container spacing={24}>
                    <Grid item xs={4}>
                        <Card
                            className={this.props.classes.card}
                        >
                            <CardActions style={{ justifyContent: "center" }}>
                                <Typography style={{ justifyContent: "center" }}>
                                No Feeds to Show
                                </Typography>
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

        return (
            <div>
                <main className={classes.content}>
                    <div className={classes.toolbar} />

                    {notes}
                </main>

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

                    </DialogContent>

                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        feeds: state.feeds
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        {
            getFeedsAction: getFeedsAction,
            getUserDetailsAction: getUserDetailsAction
        }
    )(withStyles(styles)(FeedsLayout))
);
