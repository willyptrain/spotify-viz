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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';


class Alert extends React.Component {

    constructor(props) {
        super(props);
        this.props = props
    }

    render() {
        return <MuiAlert elevation={6} variant="filled" {...this.props} />;

    }
 }




class RelatedAlbums extends React.Component {

    constructor(props) {
        super(props);
        this.nextProps = this.props;
        this.mounted = false;
        this.added = {};
        this.state = {value: 'short_term', clicked: false,
                            data: null, artist:this.props.artist, favorited: {}};


    }


    componentWillReceiveProps(nextProps) {

        let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.nextProps = nextProps;
            this.componentDidMount();

        }
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        this.mounted = true;
        axios.get(`/api/album_track_info/${this.nextProps.artist.id}/${token}`)
        .then(res => {
            fetch = res.data;
            
            if(this.mounted) {
                this.setState(oldState => ({
                    'clicked':true,
                    'album_name':fetch.album_name,
                    'album_info':fetch.tracks_in_album,
                    'popularities':fetch.popularities,
                    'track_names':fetch.track_names,
                    'track_ids': fetch.ids,
                    'previews':fetch.audio,
                    'current':null,
                    'username':fetch.username,
                    'disabled':new Array(fetch.audio.length).fill(false),
                    'notif': false
                 }));
            }
            return () => {this.mounted = false}
        })


        .catch(err => {
            console.log('error :(')
            console.log(err)
        })

    }

     componentWillUnmount() {
        this.mounted = false;
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
                    'current':url,
                    'username':oldState.username,
                    'disabled':oldState.disabled,
                    'notif': false
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
                        'current':url,
                        'username':oldState.username,
                        'disabled':oldState.disabled,
                        'notif': false
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
                        'current':url,
                        'username':oldState.username,
                        'disabled':oldState.disabled,
                        'notif': false
                    }));
                }
            }
        }
    }



    saveTrack = (track,index) => {
        let token = cookie.get('access_token');
        axios.get(`/api/track/save/${track['id']}/${this.state['username']}/${token}`)
                    .then(res => {

                        var disabled_keys = this.state['disabled'];
                        disabled_keys[index] = true
                        this.setState(oldState => ({
                            'clicked':true,
                            'album_name':oldState.album_name,
                            'album_info':oldState.album_info,
                            'popularities':oldState.popularities,
                            'track_names':oldState.track_names,
                            'previews':oldState.previews,
                            'play': oldState.play,
                            'current':oldState.current,
                            'username':oldState.username,
                            'disabled': disabled_keys,
                            'notif': true
                        }));



                    })
                    .catch(err => {
                        console.log(err);
                        console.log("error :(");
                    })
    }

    favoriteTrack = (track, index) => {
        let token = cookie.get('access_token');

        axios.get(`/api/save_to_db/${track}/${token}`)
                .then(res => {
                    this.added[track] = false;
                    let favs = this.state['favorited'];
                    favs[track] = true;
                    var disabled_keys = this.state['disabled'];
                    disabled_keys[index] = true;
                    this.setState(oldState => ({
                        'clicked':true,
                        'album_name':oldState.album_name,
                        'album_info':oldState.album_info,
                        'popularities':oldState.popularities,
                        'track_names':oldState.track_names,
                        'previews':oldState.previews,
                        'play': oldState.play,
                        'username':oldState.username,
                        'disabled':oldState.disabled,
                        'notif': false,
                        'favorited': favs,
                }));

                console.log(this.state.favorited);



                })
                .catch(err => {
                    console.log(err);
                    console.log("error :((");
                })

        }   

        unfavoriteTrack = (track, index) => {
            let token = cookie.get('access_token');
    
            axios.get(`/api/delete_from_db/${track}/favorites/${token}`)
                    .then(res => {
                        this.added[track] = false;
                        this.state.favorited[track] = false;
                        var disabled_keys = this.state['disabled'];
                        disabled_keys[index] = true;
                        this.setState(oldState => ({
                            'clicked':true,
                            'album_name':oldState.album_name,
                            'album_info':oldState.album_info,
                            'popularities':oldState.popularities,
                            'track_names':oldState.track_names,
                            'previews':oldState.previews,
                            'play': oldState.play,
                            'username':oldState.username,
                            'disabled':oldState.disabled,
                            'notif': false,
                            'in_favorites': this.in_favorites,
                            'favorited': this.favorited
                    }));
    
    
    
                    })
                    .catch(err => {
    
                        console.log("error :(");
                    })
    
            }


        handleClose = (event, reason) => {
                 this.setState(oldState => ({
                            'clicked':true,
                            'album_name':oldState.album_name,
                            'album_info':oldState.album_info,
                            'popularities':oldState.popularities,
                            'track_names':oldState.track_names,
                            'previews':oldState.previews,
                            'play': oldState.play,
                            'current':oldState.current,
                            'username':oldState.username,
                            'disabled': oldState.disabled,
                            'notif': false
                  }));


            };


            render() {

            var player_on = !this.state['play'] ? "Play" : "Stop"

            if(this.state.album_info) {


            return(

        <div style={{backgroundColor: 'white', overflow: 'scroll'}}>
        <Card>
        <CardHeader style={{fontFamily: 'Montserrat !important'}} title={this.state.album_name} subheader="Tracks in Album" />
        <CardContent>
        <List>
        {this.state.clicked &&
                    this.state.track_names.map((name, index) =>
                        <ListItem>
                            <ListItemText
                                primary={name}
                            secondary={this.state.artist.artists['0']['name']}
                             />

                            {this.state.favorited[this.state['track_ids'][index]] &&
                             <Button onClick={() => this.unfavoriteTrack(this.state['track_ids'][index], index)} > 
                    
                             <StarIcon/>
                             
                             
                             </Button>
                            }
                            {!this.state.favorited[this.state['track_ids'][index]] &&
                             <Button onClick={() => this.favoriteTrack(this.state['track_ids'][index], index)} > 
                    
                             <StarBorderIcon/>
                             
                             
                             </Button>
                            }

                             {this.state['previews'][index] &&
                             <div>
                             <Button onClick={() => this.playTrack(this.state['previews'][index], this.state['play'])}>
                             {(!(this.state['play'] && (this.state['current'] == this.state['previews'][index]))) ? "Play" : "Stop"}
                             </Button>
                             </div>
                             }
                             {
                             this.state['username']  && !this.state['disabled'][index] &&
                             <Button onClick={() => this.saveTrack(this.state['track_ids'][index], index)}>+</Button>
                               }

                        </ListItem>

                    )
                }
            </List>
        </CardContent>
            </Card>

                    <>
                        <audio ref={ref => this.player = ref} />
                    </>

                 <Snackbar open={this.state['notif']} autoHideDuration={2000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="success">
                      Track Added to library!
                    </Alert>
                  </Snackbar>



              </div>
            );

            }
            return (<div>Loading...</div>);
            }


}

export default RelatedAlbums;

