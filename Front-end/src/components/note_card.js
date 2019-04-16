import React, {Component, Fragment} from "react";
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import red from "@material-ui/core/colors/red";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import DetailsIcon from "@material-ui/icons/Details"
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import {MONTH_ARRAY} from "../properties";
import {connect} from "react-redux";
import {deleteNoteAction} from "../actions/delete_note_action";
import {getNotesAction} from "../actions/get_notes_action";
import {getUserDetailsAction} from "../actions/get_user_details_action";
import {voteNoteAction} from "../actions/vote_note_action";
import {withRouter} from "react-router-dom";
import {getUserStatusAction} from "../actions/get_user_stats_action";
import Badge from '@material-ui/core/Badge';
import {getGroupStatsAction} from "../actions/get_group_stats_action";

const styles = theme => ({
    card: {
        padding: 5,
        height: 200,
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)"
    },
    title: {
        fontSize: 14,
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
        whiteSpace: 'nowrap',
        display: 'block'
    },
    badge: {
        top: 20,
        right: -5,
        // The border color match the background color.
        border: `2px solid ${
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
            }`,
    },
});

class NoteCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            likeStatus: this.props.note.like_status,
            likeUnlikeClicked: false,
            likeCount: this.props.note.like_count,
            dislikeCount: this.props.note.dislike_count
        };
        this.showLikeDislikeIcons = this.showLikeDislikeIcons.bind(this);
        this.onClickThumbsUp = this.onClickThumbsUp.bind(this);
        this.onClickThumbsDown = this.onClickThumbsDown.bind(this);
        this.showEditIcon = this.showEditIcon.bind(this);
        this.showDeleteIcon = this.showDeleteIcon.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.deleteNote) {
            if (this.props.deleteNote != prevProps.deleteNote) {
                // Get notes again after a note is deleted.
                if (this.props.match.params.groupname) {
                    this.props.getNotesAction(this.props.authentication.token, '', this.props.match.params.groupname);
                } else if (this.props.match.params.labelname) {
                    this.props.getNotesAction(this.props.authentication.token, this.props.match.params.labelname, '');
                } else {
                    this.props.getNotesAction(this.props.authentication.token, '', '');
                }
                // Also update the labels and groups in the left panel.
                this.props.getUserDetailsAction(this.props.authentication.token);
                this.props.getUserStatusAction(this.props.authentication.token);
                this.props.getGroupStatsAction(this.props.authentication.token, this.props.match.params.groupname);
            }
        }

        //If the like status changed.
        if (this.state.likeUnlikeClicked && prevState.likeStatus != this.state.likeStatus) {
            this.props.voteNoteAction(this.props.authentication.token, this.props.note._id.$oid, this.state.likeStatus);
        }

        if (this.props.note && this.props.note !== prevProps.note) {
            this.setState({likeStatus: this.props.note.like_status, likeUnlikeClicked: false,
                likeCount: this.props.note.like_count,
                dislikeCount: this.props.note.dislike_count});
        }

    }

    showLikeDislikeIcons(classes) {
        var thumbsUpStyle = {};
        var thumbsDownStyle = {};

        if (this.state.likeStatus) {
            if (this.state.likeStatus == 1) {
                thumbsUpStyle.color = 'green';
            } else if (this.state.likeStatus == -1) {
                thumbsDownStyle.color = 'red';
            }
        }

        return (
            <Fragment>
                <Badge badgeContent={this.state.likeCount} color="primary" classes={{badge: classes.badge}}>
                    <ThumbUpIcon className={classes.iconHover} style={thumbsUpStyle} onClick={this.onClickThumbsUp}/>
                </Badge>
                <Badge badgeContent={this.state.dislikeCount} color="primary" classes={{badge: classes.badge}}>
                    <ThumbDownIcon className={classes.iconHover} style={thumbsDownStyle}
                                   onClick={this.onClickThumbsDown}/>
                </Badge>
            </Fragment>
        );

    }

    onClickThumbsUp() {
        if (this.state.likeStatus == 0) {
            this.setState({likeStatus: 1, likeUnlikeClicked: true, likeCount: this.state.likeCount+1, dislikeCount: this.state.dislikeCount});
        } else if (this.state.likeStatus == 1) {
            this.setState({likeStatus: 0, likeUnlikeClicked: true, likeCount: this.state.likeCount-1, dislikeCount: this.state.dislikeCount});
        } else if (this.state.likeStatus == -1) {
            this.setState({likeStatus: 1, likeUnlikeClicked: true, likeCount: this.state.likeCount+1, dislikeCount: this.state.dislikeCount-1});
        }
    }

    onClickThumbsDown() {
        if (this.state.likeStatus == 0) {
            this.setState({likeStatus: -1, likeUnlikeClicked: true, likeCount: this.state.likeCount, dislikeCount: this.state.dislikeCount+1});
        } else if (this.state.likeStatus == 1) {
            this.setState({likeStatus: -1, likeUnlikeClicked: true, likeCount: this.state.likeCount-1, dislikeCount: this.state.dislikeCount+1});
        } else if (this.state.likeStatus == -1) {
            this.setState({likeStatus: 0, likeUnlikeClicked: true, likeCount: this.state.likeCount, dislikeCount: this.state.dislikeCount-1});
        }
    }

    showEditIcon(classes) {
        if (this.props.location.pathname.includes("feeds")) {
            return (<Fragment></Fragment>);
        } else {
            return (
                <EditIcon className={classes.iconHover} onClick={() => {
                    this.props.showEditNoteDialog(this.props.note)
                }}/>
            );
        }
    }

    showDeleteIcon(classes) {
        if (this.props.location.pathname.includes("feeds")) {
            return (<Fragment></Fragment>);
        } else {
            return (
                <DeleteIcon className={classes.iconHover} onClick={() => {
                    this.props.deleteNoteAction(this.props.authentication.token, this.props.note._id.$oid);
                }}/>
            );
        }
    }

    render() {
        const {classes} = this.props;
        const {note} = this.props;

        const date = new Date(note.last_updated_date.$date);
        let displayDate =
            MONTH_ARRAY[date.getMonth()] +
            " " +
            date.getDate() +
            ", " +
            date.getFullYear();

        var displayContent = note.note_content.replace(/\n/g, ' ').substring(0, 30);
        const likeDislikeIcons = this.showLikeDislikeIcons(classes);
        const editIcon = this.showEditIcon(classes);
        const deleteIcon = this.showDeleteIcon(classes);

        return (
            <Card className={classes.card}>
                <CardContent onClick={() => {
                    this.props.showNoteDetailDialog(note)
                }}>
                    <Typography
                        className={`${classes.title} ${classes.myTextOverflow}`}
                        color="textSecondary"
                        gutterBottom
                    >
                        {displayDate} | {note.creation_user}
                    </Typography>
                    <Typography variant="h5" component="h2" className={classes.myTextOverflow}>
                        {note.title}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {note.visibility}
                    </Typography>
                    <Typography component="p" className={classes.myTextOverflow}>{displayContent}</Typography>
                </CardContent>
                <CardActions>
                    <DetailsIcon className={classes.iconHover} onClick={() => {
                        this.props.showNoteDetailDialog(note)
                    }}/>
                    {editIcon}
                    {deleteIcon}
                    {likeDislikeIcons}
                </CardActions>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        deleteNote: state.deleteNote
    };
}

export default withRouter(connect(
    mapStateToProps,
    {
        deleteNoteAction: deleteNoteAction, getNotesAction: getNotesAction, getUserDetailsAction: getUserDetailsAction,
        voteNoteAction: voteNoteAction, getUserStatusAction: getUserStatusAction, getGroupStatsAction: getGroupStatsAction
    }
)(withStyles(styles)(NoteCard)));
