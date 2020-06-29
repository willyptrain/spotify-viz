import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import {FetchTracks} from './FetchTracks.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './tracks.css'
import {Distribution, Box, Text} from 'grommet';
import TrackGraph from './TrackGraph.js';
import RelatedTracks from './RelatedTracks.js';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

class TopTracks extends React.Component{
    constructor(props){
        super(props);
        this.state = {value: 'short_term', clicked: false};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.value = 'short_term'
        this.onClick = this.props.onClick;
        this.showGraph = false;
        this.graphTrack =  null;
    }
    handleChange = (artist) => {
        if(this.state.artist != artist) {
                console.log(artist);
            this.setState(oldState => ({
                value: oldState.value,
                clicked: true,
                artist: artist
            }));
        }
        else {
            this.setState(oldState => ({
                value: oldState.value,
                clicked: true,
                artist: artist
            }));
        }
        this.graphTrack = <TrackGraph data={this.state} />;


      }

    changeTab = (event, new_value) => {
        event.preventDefault();
        this.setState({value: new_value});
    }

    handleSubmit = (event, new_value) => {
        console.log(event);
        console.log(new_value);
        event.preventDefault();
        this.setState({value: new_value});
    }



     async componentDidMount() {
      }

    render(){
        const track_list = <FetchTracks data={this.state.value}/>;

        return(

            <div style={{marginLeft: '30px'}} class="browser-container">
            <BrowserView>
                <form onSubmit={this.handleSubmit}>
                    <label>
                    <Tabs
                        value={this.state["value"]}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.changeTab}
                        aria-label="disabled tabs example"
                      >
                            <Tab className="track-tab" value="short_term" label="Week" />
                            <Tab className="track-tab" value="medium_term" label="Month" />
                            <Tab className="track-tab" value="long_term" label="All Time" />
                      </Tabs>
                </label>
                </form>

                {this.state['clicked'] && <Distribution style={{maxHeight:'100vh'}} className="dist-box-tracks"
              values={[
                { value: 50, className:"top-tracks", show: true, data: <FetchTracks clicked={this.state['clicked']} handleChange={this.handleChange} data={this.state.value} /> },
                { value: 25, className:"related-tracks", show: (this.state.clicked && (this.state.artist)), data: <RelatedTracks {...this.state} artist={this.state.artist} /> },
                { value: 25, className:"track-graph", show: (this.state.clicked && (this.state.artist)), data: <TrackGraph {...this.state} artist={this.state.artist} /> }
              ]}
            >
              {value => (
                <Box className={value.className} pad="small" fill>
                  {value.show && value.data}
                </Box>
              )}
            </Distribution>
            }
            {!this.state['clicked'] && <Distribution style={{maxHeight:'100vh'}} className="dist-box-tracks"
              values={[
                { value: 100, className:"top-tracks", show: true, data: <FetchTracks clicked={this.state['clicked']} handleChange={this.handleChange} data={this.state.value} /> }
              ]}
            >
              {value => (
                <Box className={value.className} pad="small" fill>
                  {value.show && value.data}
                </Box>
              )}
            </Distribution>
            }


            </BrowserView>

            <MobileView>
            <form onSubmit={this.handleSubmit}>
                    <label>
                    <Tabs
                        value={this.state["value"]}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.changeTab}
                        aria-label="disabled tabs example"
                      >
                            <Tab className="track-tab" value="short_term" label="Week" />
                            <Tab className="track-tab" value="medium_term" label="Month" />
                            <Tab className="track-tab" value="long_term" label="All Time" />
                      </Tabs>
                </label>
                </form>
             <FetchTracks handleChange={this.handleChange} data={this.state.value} />
            </MobileView>

            </div>


        );
    }
}

export default TopTracks;