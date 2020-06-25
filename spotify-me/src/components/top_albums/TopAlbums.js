import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import {FetchAlbums} from './FetchAlbums.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './topalbums.css'
import {Distribution, Box, Text} from 'grommet';
import AlbumGraph from './AlbumGraph.js';
import RelatedAlbums from './RelatedAlbums.js';
import { BrowserView,MobileView,isBrowser,isMobile} from "react-device-detect";
import PopularityChart from './PopularityChart.js';


class TopAlbums extends React.Component{
    constructor(props){
        super(props);
        this.state = {value: 'short_term'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.value = 'short_term'
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
        this.graphTrack = <FetchAlbums data={this.state} />;


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
        const track_list = <FetchAlbums data={this.state.value}/>;

        return(
            <div class="browser-container">
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

                <Distribution
              values={[
                { value: 50, className:"top-tracks", show: true, data: <FetchAlbums handleChange={this.handleChange} data={this.state.value} /> },
                { value: 30, className:"track-graph", show: (this.state.clicked && (this.state.artist)), data: <AlbumGraph {...this.state} artist={this.state.artist} /> },
                { value: 20, className:"related-tracks", show: (this.state.clicked && (this.state.artist)), data: <RelatedAlbums {...this.state} artist={this.state.artist} /> },
                { value: 10, className:"related-tracks", show: (this.state.clicked && (this.state.artist)), data: <PopularityChart {...this.state} artist={this.state.artist} /> }
              ]}
            >
              {value => (
                <Box className={value.className} pad="small" fill>
                  {value.show && value.data}
                </Box>
              )}
            </Distribution>
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
             <FetchAlbums handleChange={this.handleChange} data={this.state.value} />
            </MobileView>

            </div>
        );
    }
}

export default TopAlbums;