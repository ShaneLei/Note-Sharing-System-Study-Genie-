import React, {Component} from 'react';
import ReactChartkick, {LineChart, PieChart} from 'react-chartkick'
import Chart from 'chart.js'
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";
import {logoutAction} from "../actions/authentication_action";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

ReactChartkick.addAdapter(Chart)

class InteractivePieChart extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        let data = {"Sunday": 0, "Monday": 0, "Tuesday": 0, "Wednesday": 0, "Thursday": 0, "Friday": 0, "Saturday": 0};
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];

        if(this.props.userStats){
            for(let i=0; i<this.props.userStats.login_day_count.length; i++){
                data[days[i]] = this.props.userStats.login_day_count[i];
            }
        }

        return (
            <div>
                <Typography variant="title" style={{'text-align': 'center'}}>Login Logout Data :</Typography>
                <br/>
                <PieChart data={data}/>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        userStats: state.userStats
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        {  }
    )(InteractivePieChart)
);
