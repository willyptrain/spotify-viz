import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import {BrowserView, MobileView} from 'react-device-detect';
import Carousel from 'react-material-ui-carousel'
import 'react-multi-carousel/lib/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from '@material-ui/core/Slider';
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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ScrollIntoView from 'react-scroll-into-view';
import GenreChart from '../dashboard/GenreChart.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';


export function ScrollGenres(data) {

    const all_genres = ['acoustic', 'alt-rock', 'alternative',
                'ambient', 'anime', 'bluegrass', 'blues',
                'chill', 'classical', 'club',
                'country', 'dance',
                'deep-house','disco',
                'drum-and-bass', 'edm', 'electro',
                'electronic', 'emo', 'folk',
                'goth','hard-rock',
                'heavy-metal', 'hip-hop', 'holidays',
                'house', 'indie',
                'jazz',
                'k-pop', 'kids',
                'metal',
                'new-age','opera', 'party',
                'piano', 'pop',
                'punk',
                'r-n-b', 'rainy-day', 'reggae',
                'rock-n-roll',
                'sad', 'salsa',
                'sleep', 'soul',
                'techno',
                'work-out', 'world-music'].sort();
    const [selectedGenre, setSelectedGenre] = React.useState("")


    const getRecommended = (event) => {

        setSelectedGenre(event.target.textContent);
        data.getTracks(event.target.textContent);

    }

    return (<div>
        <h2 style={{fontFamily: 'Montserrat'}}>All Genres</h2>
        <List>
        {all_genres.map((genre, index) =>
            <ListItem selected={selectedGenre == genre} value={genre} style={{fontFamily: 'Montserrat'}} divider={true} onClick={getRecommended}>
                <ListItemText value={genre} primary={genre} onClick={getRecommended} />
            </ListItem>

        )}
        </List>

    </div>)

}

export function RecommendedTracksPanel(data) {

        console.log(data.recommended)
//        const genres_element = (<TableCell className="table-results" align="center">{data['artist_info'][index]['genres'].join(", ")}</TableCell>);

        return (
        <div>

                <div>
                <TableContainer style={{marginLeft: '10px'}} component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell size="medium" className="table-header" classes="rec-table-header" align="left">Track Name</TableCell>
                        <TableCell size="medium" className="table-header" classes="rec-table-header" align="left">Artist</TableCell>
                        <TableCell size="medium" className="table-header" classes="rec-table-header" align="right">Duration</TableCell>
                        <TableCell size="medium" className="table-header" classes="rec-table-header" align="right">Popularity</TableCell>
                      </TableRow>
                    </TableHead>

                    {'recommended' in data && data.recommended && data['recommended'].map((track,index) =>
            <TableRow key={track['name']} component="a" href={`/track/${track['id']}`}>
              <TableCell className="table-results" component="th" scope="row">
                <div className="avatar-head">
                    <Avatar className="table-avatar" src={track['album']['images'].length > 0 ? track['album']['images'][0]['url'] : ""} />&emsp; <h6 className="track-name">{track.name}</h6>
                </div>
              </TableCell>
              <TableCell className="table-results" align="left">{track['artists'][0]['name']}</TableCell>
              <TableCell className="table-results" align="right">{Math.trunc(track['duration_ms']/60000) + ":" +
                        Math.trunc((track['duration_ms']/60000-Math.trunc(track['duration_ms']/60000))*60)}</TableCell>
              <TableCell className="table-results" align="right">{track['popularity']}</TableCell>
            </TableRow>

                     )}


               </Table>
               </TableContainer>
            </div>












        </div>

        );

}



class RecommendedPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {}
        this.getRecommendedTracks = this.getRecommendedTracks.bind(this)
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        axios.get(`/api/user_info/${token}/`)
        .then(res => {
            console.log(res.data);
            this.setState({ ...res.data[0], genres: [
                  {
                    value: 0,
                    label: res.data[0].long_term_genres[0],
                    name: 0
                  },
                  {
                    value: 25,
                    label: res.data[0].long_term_genres[1],
                    name: 1
                  },
                  {
                    value: 50,
                    label: res.data[0].long_term_genres[2],
                    name: 2
                  },
                  {
                    value: 75,
                    label: res.data[0].long_term_genres[3],
                    name: 3
                  },
                  {
                    value: 100,
                    label: res.data[0].long_term_genres[4],
                    name: 4
                  }],
                  selectedGenre: res.data[0].long_term_genres[0]
               });
            this.mappings = {0: res.data[0].long_term_genres[0], 25: res.data[0].long_term_genres[1], 50: res.data[0].long_term_genres[2],
                            75: res.data[0].long_term_genres[3], 100: res.data[0].long_term_genres[4]}
            this.getRecommendedTracks(res.data[0].long_term_genres[0]);
        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })




    }

    handleChange = (event, new_val) => {


        this.getRecommendedTracks(this.mappings[new_val]);
//        var new_genres = this.state['genres'];
//        new_genres[event.target.name] = event.target.checked;
//        this.setState({ ...this.state, genres: new_genres });

    }


    getRecommendedTracks(genre) {
        let token = cookie.get('access_token');

//        let copy_genres = this.state['genres']
//        let filtered_list = genre_list.filter(function(item,index) {
//            return copy_genres[index] == true;
//        })
        axios.get(`/api/recommended_by_genre/${genre}/${token}/`)
        .then(res => {
            console.log(res.data);
            this.setState(oldState => ({
                followers: oldState.followers,
                getTracks: oldState.getTracks,
                image_url: oldState.image_url,
                long_genre_scores: oldState.long_genre_scores,
                long_term_genres: oldState.long_term_genres,
                short_genre_scores: oldState.short_genre_scores,
                short_term_genres: oldState.short_term_genres,
                subscription: oldState.subscription,
                user_id: oldState.user_id,
                user_url: oldState.user_url,
                username: oldState.username,
                recommended: res.data.search.tracks.items,
                artist_info: res.data.artist_info,
                genres: oldState.genres,
                  selectedGenre: genre
            }));


        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })

    }



    render() {

        const styles = {
            root: {
                backgroundColor: 'green !important',
            },
            colorPrimary: {
                backgroundColor: 'green !important',
                color: 'green !important',
            }

        };

        console.log(this.state);
        return (
            <div style={{marginTop: `2vh`, marginLeft: '84px', width: '92%'}}>
                {'long_term_genres' in this.state &&
                <div style={{width: '60%', position: 'relative', left: '15%'}}>
                    <Slider classes={styles}
                    defaultValue={0}
                    getAriaValueText={""}
                    aria-labelledby="discrete-slider-always"
                    step={25}
                    color="primary"
                    marks={this.state['genres']}
                    valueLabelDisplay="off"
                    onChange={this.handleChange}
                  />

                </div>}


                {'recommended' in this.state &&
                    <Card width="100%" height="100%" style={{backgroundColor: "white", overflow: 'scroll'}} className="userinfo-card">
                        <RecommendedTracksPanel key={this.state['selectedGenre']} {...this.state} />
                    </Card>
                }


             {!this.state['username'] &&
                  <div class="loading">
                    <CircularProgress/>
                  </div>
              }


            </div>

        );

    }



}
export default RecommendedPage;










//
//
//
//<FormControl onChange={this.getRecommendedTracks} component="fieldset">
//                        <FormLabel component="legend">Recommendations by Genre:</FormLabel>
//                        <FormGroup>
//                          <FormControlLabel
//                            control={<Checkbox checked={this.state['genres'][0]} onChange={this.handleChange} name={0} />}
//                            label={this.state['long_term_genres'][0]}
//                          />
//                          <FormControlLabel
//                            control={<Checkbox checked={this.state['genres'][1]} onChange={this.handleChange} name={1} />}
//                            label={this.state['long_term_genres'][1]}
//                          />
//                          <FormControlLabel
//                            control={<Checkbox checked={this.state['genres'][2]} onChange={this.handleChange} name={2} />}
//                            label={this.state['long_term_genres'][2]}
//                          />
//                          <FormControlLabel
//                            control={<Checkbox checked={this.state['genres'][3]} onChange={this.handleChange} name={3} />}
//                            label={this.state['long_term_genres'][3]}
//                          />
//                          <FormControlLabel
//                            control={<Checkbox checked={this.state['genres'][4]} onChange={this.handleChange} name={4} />}
//                            label={this.state['long_term_genres'][4]}
//                          />
//                        </FormGroup>
//                      </FormControl>













