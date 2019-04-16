import React, {Component, Fragment} from 'react';
import {Radar, RadarChart, PolarGrid, Legend,
    PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import {withStyles} from "@material-ui/core/styles";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";



class SimpleRadarChart extends Component {
    render() {

        if(this.props.userStats && this.props.userStats.label_data.length > 0  ){
            return (
                <Fragment>
                    <Typography variant="title" style={{'text-align': 'center'}}>Note Labels :</Typography>
                    <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={this.props.userStats.label_data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="value" />
                        <PolarRadiusAxis/>
                        <Radar name="Test" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
                    </RadarChart>
                </Fragment>

            );
        }else{
            return (<Fragment>No Label Data to Show.</Fragment>);
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
)(SimpleRadarChart);
