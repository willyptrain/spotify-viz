import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import {BrowserView, MobileView} from 'react-device-detect';
import Carousel from 'react-material-ui-carousel'
import 'react-multi-carousel/lib/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Doughnut, Radar } from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import ItemsCarousel from 'react-items-carousel';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import Icon from '@material-ui/core/Icon';
import { Grommet, Distribution, Box, Text, grommet } from 'grommet';
import ArtistPage from '../top_artists/ArtistPage.js';
import RelatedTracks from '../top_tracks/RelatedTracks.js';
import '../top_artists/artists.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import AudioPlayer from 'material-ui-audio-player';
import './trackPage.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ScrollIntoView from 'react-scroll-into-view';

export function AlbumList(data) {

    console.log(data);
    let track_id = data.track_id;
//    const classes = theme => ({
//      tableRow: {
//        "&$selected, &$selected:hover": {
//          backgroundColor: "purple"
//        }
//      },
//      selected: {}
//    });
    let selected_id = React.createRef();
     useEffect(() => {
        selected_id.current.scrollIntoView();
    })


    return (
        <div className="albumList" style={{height: '81vh'}}>
             <TableContainer style={{background: 'white', height: '100%'}} >
                <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell size="medium" className="album-table-header" classes="table-header" align="left">Track Name</TableCell>
                        <TableCell size="medium" className="album-table-header" classes="table-header" align="left">Duration</TableCell>

                      </TableRow>
                    </TableHead>
                    { data.album && data.album.map((track,index) =>
                    <TableRow ref={selected_id} id={track['id']} selected={(track['id'] == track_id)}  key={track['name']}>

                        <TableCell className="table-results" component="th" scope="row">
                            <h6 className="track-name">{track.name}</h6>
                          </TableCell>
                          <TableCell className="table-results" align="center">{Math.trunc(track['duration_ms']/60000) + ":" +
                                    ((Math.trunc((track['duration_ms']/60000-Math.trunc(track['duration_ms']/60000))*60) < 10) ? "0"+Math.trunc((track['duration_ms']/60000-Math.trunc(track['duration_ms']/60000))*60) : Math.trunc((track['duration_ms']/60000-Math.trunc(track['duration_ms']/60000))*60)) }
                          </TableCell>
                     </TableRow>
                    )}
                    </Table>
             </TableContainer>


        </div>
    );


}
export function ArtistChart(data) {

    console.log(data)
    let chart = data.chart;
    let chartReference = React.createRef();
    var genres = [];
    var i;
    for (i in data.artists) {
        console.log(data.artists[i])
        genres = genres.concat(data.artists[i]['genres'])
    }
    var count = {};
    genres.forEach(number => count[number] = (count[number] || 0) +1);
    let frequencies = Object.values(count)
    let datasets = [{
        data: frequencies,
        labels: genres,
        backgroundColor: chart == "doughnut" ? ['#f1a5ba', '#f5b565', '#fbd981', '#93dcdc', '#6cb8ee'] : 'rgba(108, 184, 238,0.6)'
    }];
    let chartData = [{
        labels: genres,
        datasets: datasets
    }]
    let mobile = false; //CHANGE THIS LATER

    return (
        <div>
            <Doughnut style={{height: '25vh'}} ref={chartReference}
                                    data={chartData[0]} options={{
                                        title: {
                                            display: true,
                                            text: 'Artists Top Genres',
                                            fontFamily: 'Montserrat',
                                            fontSize: '18'
                                        },
                                        legend: {
                                            display:  mobile ? false : true,
                                        },
                                         responsive:  mobile ? false : true,

                                    }} />



        </div>


    );

}

export function TabbedTracks(data) {

    const [value, setValue] = useState(0);

    const handleChange = (event, new_value) => {
        event.preventDefault()
        setValue(new_value)
        console.log(new_value);

    }


    return (
        <div>
            <AppBar classes="track-navbar" style={{position: 'relative', background: 'white', zIndex: '3'}} className="track-navbar">
                <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" aria-label="simple tabs example">
                  <Tab value={0} label="Album Tracks" />
                  <Tab value={1} label="Related Tracks" />
                </Tabs>
              </AppBar>
            {value == 0 &&
                <AlbumList style={{height: '81vh'}}  {...data} album={data['album_track']} />

            }
            {value == 1 &&
                <RelatedTracks style={{background: 'white'}} {...data} tableHeader={true} header={false} artist={data.artists[0]} />

            }


        </div>
    );

}



export function TrackPlayback(data) {

//album_track: (21) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
//artist: {external_urls: {…}, href: "https://api.spotify.com/v1/artists/4MCBfE4596Uoi2O4DtmEMz", id: "4MCBfE4596Uoi2O4DtmEMz", name: "Juice WRLD", type: "artist", …}
//track_id: "0jo6Nd4iJU0UFHqS0Xd4l4"
//track_info:
//album: {album_type: "album", artists: Array(1), available_markets: Array(92), external_urls: {…}, href: "https://api.spotify.com/v1/albums/1R6vbGGXSEZZmTGn7ewwRL", …}
//artists: [{…}]
//available_markets: (92) ["AD", "AE", "AL", "AR", "AT", "AU", "BA", "BE", "BG", "BH", "BO", "BR", "BY", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK", "DO", "DZ", "EC", "EE", "EG", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HR", "HU", "ID", "IE", "IL", "IN", "IS", "IT", "JO", "JP", "KW", "KZ", "LB", "LI", "LT", "LU", "LV", "MA", "MC", "MD", "ME", "MK", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "OM", "PA", "PE", "PH", "PL", "PS", "PT", "PY", "QA", "RO", "RS", "RU", "SA", "SE", "SG", "SI", "SK", "SV", "TH", "TN", "TR", "TW", "UA", "US", "UY", "VN", "XK", "ZA"]
//disc_number: 1
//duration_ms: 200628
//explicit: true
//external_ids: {isrc: "USUG12001902"}
//external_urls: {spotify: "https://open.spotify.com/track/0jo6Nd4iJU0UFHqS0Xd4l4"}
//href: "https://api.spotify.com/v1/tracks/0jo6Nd4iJU0UFHqS0Xd4l4"
//id: "0jo6Nd4iJU0UFHqS0Xd4l4"
//is_local: false
//name: "Fighting Demons"
//popularity: 82
//preview_url: "https://p.scdn.co/mp3-preview/6deb0bd1f2e187b43f79016588695e93d326b0d1?cid=eb173f7af2f14a189be9011019c90df2"
//track_number: 13
//type: "track"
//uri: "spotify:track:0jo6Nd4iJU0UFHqS0

    const muiTheme = createMuiTheme({});

    return (
        <div className="player-container" style={{position: 'relative', height: 'inherit'}}>
            <div className="playback-img-container">
                <img className="playback-img" src={data.track_info.album.images[0].url} alt=""/>
            </div>
            <div style={{position: 'absolute', bottom: '20px'}} className="audio-controls">
                <ThemeProvider style={{position: 'absolute', bottom: '10px'}} className="audio-controls">
                  <AudioPlayer src={data.track_info['preview_url']} />
                </ThemeProvider>
            </div>
        </div>

    );

}


class TrackPage extends React.Component{
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {'track_id': props.id.uri}
//        <ArtistPage handleChange={this.handleChange} {...this.state} />

    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        axios.get(`/api/trackPage/${this.state['track_id']}/${token}/`)
        .then(res => {
            console.log(res.data);
            this.setState(oldState => ({
                'track_id': oldState.track_id,
                'track_info':res.data.track,
                'artists':res.data.artists,
                'album_track': res.data.album_tracks.items,
                'album':res.data.album
            }));
            console.log(res.data.track);

        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })


    }

    render() {
        return (
            <div style={{ overflow: 'hidden', marginTop: `3vh`, marginLeft: '84px', width: '100%'}}>
                <BrowserView>
                    {'artists' in this.state &&
                        <Grid style={{width: 'calc(97% - 84px)'}} container className="grid-container" alignItems="center" justify="center" spacing={0}>
                            <Grid item xs={12}>
                                <TabbedTracks {...this.state} album={this.state['album_track']} artist={this.state.artists[0]} />
                            </Grid>
                        </Grid>

                    }
                </BrowserView>

            </div>
        );

    }

}

export default TrackPage;
//<Grommet style={{overflow: 'hidden', width: '100%',backgroundColor: "#EBEBEB"}} full>
//                        {'artists' in this.state &&
//                        <Distribution style={{overflow: 'hidden'}} margin="xsmall" gap="none"
//                          fill
//                          values={[
//                            { value: 25, color: "white", overflow: false, title: "Artist Image", data: <TrackPlayback {...this.state} /> },
//                            { value: 25, color: "white", overflow: false, title: "Artist Image", data: <ArtistChart chart="doughnut" {...this.state}  /> },
//                            { value: 25, color: "white", overflow: true, title: "Track Preview", data: <RelatedTracks {...this.state} artist={this.state.artists[0]} /> },
//                            { value: 25, color: "white", overflow: true, title: "Album Tracks", data: <AlbumList album={this.state['album_track']} /> }
 //]}
//                        >
//                          {value => (
//
//                                <Card width="100%" height="100%" style={{backgroundColor: "white", overflow: value.overflow ? 'scroll': 'hidden'}} className="userinfo-card">
//                                    {value.data}
//                                </Card>
//
//                          )}
//                        </Distribution>}
//                      </Grommet>
//<Grommet style={{overflow: 'hidden', width: '100%',backgroundColor: "#EBEBEB"}} full>
//                        {'artists' in this.state &&
//                        <Distribution style={{overflow: 'hidden'}} margin="xsmall" gap="none"
//                          fill
//                          values={[
//                            { value: 25, color: "white", flexBasis: '40%', overflow: false, title: "Artist Image", data: <TrackPlayback {...this.state} /> },
//                            { value: 25, color: "white", flexBasis: '40%', overflow: false, title: "Artist Image", data: <ArtistChart chart="doughnut" {...this.state}  /> },
//                            { value: 50, color: "white", flexBasis: '60%', overflow: true, title: "Track Preview", data: <TabbedTracks {...this.state} album={this.state['album_track']} artist={this.state.artists[0]} /> },
//                       ]} >
//                          {value => (
//
//                                <Card width="100%" height="100%" style={{backgroundColor: "white", overflow: value.overflow ? 'scroll': 'hidden'}} className="userinfo-card">
//                                    {value.data}
//                                </Card>
//
//                          )}
//                        </Distribution>}
//                      </Grommet>
