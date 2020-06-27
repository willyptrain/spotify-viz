import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image } from 'semantic-ui-react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import './topalbums.css'
import { Link } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import ArtistPage from '../artist/ArtistPage.js'
import TopAlbums from './TopAlbums.js';
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';





class RelatedAlbums extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props);

            this.chartReference = React.createRef();

            this.state = {value: 'short_term', clicked: false,
                            data: null, artist:this.props.artist};


    }

    componentWillReceiveProps(nextProps) {
            let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.componentDidMount();

        }
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        axios.get(`http://localhost:5000/album_track_info/${this.props.artist.id}/${token}`)
        .then(res => {
            fetch = res.data;
            this.setState({
                'clicked':true,
                'album_name':fetch.album_name,
                'album_info':fetch.tracks_in_album,
                'popularities':fetch.popularities,
                'track_names':fetch.track_names,
                'previews':fetch.audio,
                'current':null
            })
            console.log(fetch);
        })

        .catch(err => {
            console.log('error :(')
            console.log(err)
        })


    }


    playTrack = (url, play) => {
        if(url) {
            if(url != this.state['current'] && this.state['current']) {
                this.player.pause();
                this.player.src = url;
                this.setState(oldState => ({
                    'clicked':true,
                    'album_name':oldState.album_name,
                    'album_info':oldState.album_info,
                    'popularities':oldState.popularities,
                    'track_names':oldState.track_names,
                    'previews':oldState.previews,
                    'play':true,
                    'current':url
                }));
                this.player.play();
            }
            else {
              this.player.src = url;
              if(!play) {
                  this.player.play()
                   this.setState(oldState => ({
                        'clicked':true,
                        'album_name':oldState.album_name,
                        'album_info':oldState.album_info,
                        'popularities':oldState.popularities,
                        'track_names':oldState.track_names,
                        'previews':oldState.previews,
                        'play':true,
                        'current':url
                    }));

                }
                else {
                    this.player.pause();
                    this.setState(oldState => ({
                        'clicked':true,
                        'album_name':oldState.album_name,
                        'album_info':oldState.album_info,
                        'popularities':oldState.popularities,
                        'track_names':oldState.track_names,
                        'previews':oldState.previews,
                        'play': false,
                        'current':url
                    }));

                }
            }

        }
    }


    saveTrack = (track) => {
        console.log(track);
        let token = cookie.get('access_token');
        console.log(this.props);
        console.log(this.userInfo);
        axios.get(`http://localhost:5000/track/save/${track['id']}/${'screamywill'}/${token}`)

    }



            render() {

            var player_on = !this.state['play'] ? "Play" : "Stop"

            if(this.state.album_info) {
            return(

        <div style={{backgroundColor: 'white', overflow: 'scroll'}}>
        <Card>
        <CardHeader title={this.state.album_name} subheader="Tracks in Album" />
        <CardContent>
        <List>
            {this.state.clicked &&
                this.state.track_names.map((name, index) =>
                    <div>
                    <ListItem>
                        <ListItemText
                            primary={name}

                         />
                         {this.state['previews'][index] &&
                             <div>
                             <Button onClick={() => this.playTrack(this.state['previews'][index], this.state['play'])}>
                                    {(!(this.state['play'] && (this.state['current'] == this.state['previews'][index]))) ? "Play" : "Stop"}</Button>
                             </div>
                             }
                             <Button onClick={() => this.saveTrack(this.state['album_info'][index])}>+</Button>

                    </ListItem>
                    <Divider />
                    </div>
                )
            }
            </List>
        </CardContent>
            </Card>

                    <>
                        <audio ref={ref => this.player = ref} />
                    </>

              </div>
            );

            }
            return (<div></div>);
            }


}

export default RelatedAlbums;

