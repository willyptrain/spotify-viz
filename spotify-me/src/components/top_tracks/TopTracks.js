import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import {FetchTracks} from './FetchTracks.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './tracks.css'


class TopTracks extends React.Component{
    constructor(props){
        super(props);
        this.state = {value: 'short_term'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.value = 'short_term'
    }
    handleChange = (event, new_value) => {
        this.setState({value: new_value});

      }
    handleSubmit = (event, new_value) => {
        event.preventDefault();
        this.setState({value: new_value});
    }


     async componentDidMount() {
      }

    render(){
        const track_list = <FetchTracks data={this.state.value}/>;

        return(
            <div style={{ marginTop: `64px`, marginLeft: '84px'}}>
                <form onSubmit={this.handleSubmit}>
                    <label>
                    <Tabs
                        value={this.state["value"]}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.handleChange}
                        aria-label="disabled tabs example"
                      >
                            <Tab className="track-tab" value="short_term" label="Week" />
                            <Tab className="track-tab" value="medium_term" label="Month" />
                            <Tab className="track-tab" value="long_term" label="All Time" />
                      </Tabs>
                </label>
                </form>
                {track_list}
            </div>
        );
    }
}

export default TopTracks;