import React, {Component, Fragment} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";



class SimpleBarChart extends Component {

    render() {
        if(this.props.userStats && this.props.userStats.group_data.length > 0){
            return (
                <Fragment>
                    <Typography variant="title" style={{'text-align': 'center'}}>Group Contributions :</Typography>
                    <br/>
                    <BarChart width={600} height={300} data={this.props.userStats.group_data}
                              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend />
                        <Bar dataKey="Users notes" fill="#8884d8" />
                        <Bar dataKey="Total Notes" fill="#82ca9d" />
                    </BarChart>
                </Fragment>

            );
        }else{
            return(<Fragment>No Group data found.</Fragment>);
        }


    }
}


function mapStateToProps(state) {
    return {
        userStats: state.userStats
    };
}

export default connect(
    mapStateToProps,
    {  }
)(SimpleBarChart);

