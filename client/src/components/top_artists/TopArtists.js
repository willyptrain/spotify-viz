import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import {FetchArtists} from './FetchArtists.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './artists.css'
import {Distribution, Box, Text} from 'grommet';
import { BrowserView,MobileView,isBrowser,isMobile} from "react-device-detect";
import ArtistPage from './ArtistPage.js'

class TopArtists extends React.Component{
    constructor(props){
        super(props);
        this.state = {value: 'short_term', artist_side: 100};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.value = 'short_term'
    }
    handleChange = (artist) => {
        console.log(artist)
        if(this.state.artist != artist) {
            this.setState(oldState => ({
                value: oldState.value,
                clicked: true,
                artist: artist,
                artist_side: 70
            }));
        }



      }
    handleSubmit = (event, new_value) => {

        this.setState({value: new_value, clicked: false, artist_side: 100});
    }


     async componentDidMount() {
      }

    render(){
        const artist_list = <FetchArtists data={this.state.value}/>;

        return(
        <div style={{marginLeft: '30px'}} >
        <BrowserView>
            <div class="browser-container" style={{ marginLeft: '0px'}}>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                        <Tabs
                            value={this.state["value"]}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={this.handleSubmit}
                            aria-label="disabled tabs example"
                          >
                                <Tab className="track-tab" value="short_term" label="Week" />
                                <Tab className="track-tab" value="medium_term" label="Month" />
                                <Tab className="track-tab" value="long_term" label="All Time" />
                          </Tabs>
                    </label>
                    </form>


                    {this.state['clicked'] && <Distribution
                  values={[
                    { value: this.state.artist_side, className:"top-tracks", show: true, data: <FetchArtists clicked={this.state['clicked']} handleChange={this.handleChange} data={this.state.value} /> },
                    { value: 100-this.state.artist_side, className:"track-graph", show: (this.state.clicked && (this.state.artist)), data: <ArtistPage handleChange={this.handleChange} {...this.state} /> }

                  ]}
                >
                  {value => (
                    <Box className={value.className} pad="small" fill>
                      {value.show && value.data}
                    </Box>
                  )}
                </Distribution>}

                {!this.state['clicked'] && <Distribution
                  values={[
                    { value: 100, className:"top-tracks", show: true, data: <FetchArtists clicked={this.state['clicked']} handleChange={this.handleChange} data={this.state.value} /> },
                  ]}
                >
                  {value => (
                    <Box className={value.className} pad="small" fill>
                      {value.show && value.data}
                    </Box>
                  )}
                </Distribution>}


            </div>
            </BrowserView>


        <MobileView>
            <div style={{ marginTop: `0px`, marginLeft: '30px'}}>
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
                <Distribution
                  values={[
                    { value: 100, className:"top-tracks", show: true, data: <FetchArtists clicked={this.state['clicked']} handleChange={this.handleChange} data={this.state.value} /> },
                  ]}
                >
                  {value => (
                    <Box className={value.className} pad="small" fill>
                      {value.show && value.data}
                    </Box>
                  )}
                </Distribution>


            </div>
            </MobileView>
            </div>
        );
    }
}

export default TopArtists;