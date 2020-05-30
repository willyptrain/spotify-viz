import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import {FetchTracks} from './fetchTracks.js';

/*
const TopTracks = () => {
  return (
    <div className="TopTracks">
        <FetchTracks time_period='short_term'/>
    </div>
  );
}
*/

class TopTracks extends React.Component{
    constructor(props){
        super(props);
        const tracks = [];

        this.state = { tracks };
    }
    render(){
        return(
            <div>
                <FetchTracks time_period={`short_term`} />
            </div>
        );
    }
}

export default TopTracks;