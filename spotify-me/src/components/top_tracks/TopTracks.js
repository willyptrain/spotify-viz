import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import {FetchTracks} from './FetchTracks.js';


class TopTracks extends React.Component{
    constructor(props){
        super(props);
        this.state = {value: 'short_term'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = (event) => {
        this.setState({value: event.target.value});
      }
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({value: event.target.value});
    }

     async componentDidMount() {
      }

    render(){
        console.log("yo")
        const track_list = <FetchTracks data={this.state.value}/>;
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                <select onChange={this.handleChange} required>
                    <option value="selected"> Select option...</option>
                    <option value="short_term">Week</option>
                    <option value="medium_term">Month</option>
                    <option value="long_term">All Time</option>
                </select>
                </label>
                </form>
                {track_list}
            </div>
        );
    }
}

export default TopTracks;