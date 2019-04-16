import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import AddCircleIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import NoteCard from "./note_card";
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SimpleBarChart from "./bar_chart";
import InteractivePieChart from "./pie_chart";
import SimpleRadarChart from "./radar_chart";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";
import {getUserStatusAction} from "../actions/get_user_stats_action";
import WordCloud from "./word_cloud";


const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        marginLeft: drawerWidth,
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3
    },
    card: {
        height: 300,
    },
    icon_add: {
        fontSize: 150
    }
});

class VisualizeLayout extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getUserStatusAction(this.props.authentication.token);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Grid container spacing={24} alignItems="center"
                          justify="center"
                          direction="column">
                        <Grid item xs={12} justify="center">
                                <SimpleBarChart/>
                        </Grid>
                        <Divider variant="middle" />
                        <Grid item xs={12} justify="center">
                                <InteractivePieChart/>
                        </Grid>
                        <Divider variant="middle" />
                        <Grid item xs={12} justify="center">
                                <SimpleRadarChart/>
                        </Grid>
                        <Divider variant="middle" />
                        <Grid item xs={12} justify="center">
                            <WordCloud/>
                        </Grid>
                    </Grid>


                </main>
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
        {
            getUserStatusAction: getUserStatusAction
        }
    )(withStyles(styles)(VisualizeLayout))
);
