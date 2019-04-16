import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {TagCloud} from "react-tagcloud";
import Typography from "@material-ui/core/Typography";


class WordCloud extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        var data = [];

        if (this.props.userStats) {
            data = this.props.userStats.word_data;
        }

        return (
            <Fragment>
                <Typography variant="title" style={{'text-align': 'center'}}>Word Frequency :</Typography>
                <br/>
                {<TagCloud minSize={12} maxSize={35} tags={data} style={{"maxWidth": "500px"}}
                           onClick={tag => this.setState({word: `Word : '${tag.value}' Count : ${tag.count}`})}/>}
                <Typography style={{'text-align': 'center'}}>{
                    this.state.word
                        ? this.state.word
                        : 'Click on a word to display stats'
                }</Typography>
                <br/>

            </Fragment>
        );


    }
}


function mapStateToProps(state) {
    return {
        userStats: state.userStats
    };
}

export default connect(
    mapStateToProps,
    {}
)(WordCloud);
