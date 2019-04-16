import React, {Component, Fragment} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";


class GroupBarChart extends Component {

    render() {

        if (this.props.groupStats && this.props.groupStats.group_stats && this.props.groupStats.group_stats.length > 0) {
            return (
                <Fragment>
                    <Typography variant="title" style={{'text-align': 'center'}}>Group Contributions :</Typography>
                    <br/>
                    <BarChart width={600} height={300} data={this.props.groupStats.group_stats}
                              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="Note Count" fill="#c6c627"/>
                        <Bar dataKey="Like count" fill="#82ca9d"/>
                        <Bar dataKey="Dislike Count" fill="#db3d15"/>
                    </BarChart>
                </Fragment>

            );
        } else {
            return (<Fragment> </Fragment>);
        }


    }
}

function mapStateToProps(state) {
    return {
        groupStats: state.groupStats
    };
}

export default connect(
    mapStateToProps,
    {}
)(GroupBarChart);

