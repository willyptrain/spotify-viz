import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image } from 'semantic-ui-react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import './tracks.css'
import { Link } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import ArtistPage from '../artist/ArtistPage.js'
import TopTracks from './TopTracks.js';
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
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



class RelatedTracks extends React.Component {

    constructor(props) {
        super(props);
        console.log("mee");
            this.added = {};
            this.chartReference = React.createRef();
            this.nextProps = this.props;
            this.state = {value: 'short_term', clicked: false,
                            data: null, artist:this.props.artist, play: false, notif: false, favorited: {}};


    }

    componentWillReceiveProps(nextProps) {
            let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.nextProps = nextProps
            this.componentDidMount();

        }
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        axios.get(`/api/related_tracks/${this.nextProps.artist.id}/${token}`)
        .then(res => {
            fetch = res.data;
            this.setState({
                'clicked':true,
                'artists':fetch.artists,
                'track_names':fetch.song_names,
                'images':fetch.images,
                'previews':fetch.audio,
                'current':null,
                'track_ids':fetch.ids,
                'username':fetch.username,
                'disabled':new Array(fetch.audio.length).fill(false),
                'notif': false,
                'in_favorites': fetch.in_favorites,
            });

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
                    'clicked':oldState.clicked,
                    'artists':oldState.artists,
                    'track_names':oldState.track_names,
                    'images':oldState.images,
                    'previews':oldState.previews,
                    'play':true,
                    'current':url,
                    'track_ids':oldState.track_ids,
                    'username':oldState.username,
                    'disabled':oldState.disabled,
                    'notif': false,
                    'in_favorites': oldState.in_favorites,

                }));
                this.player.play();
            }
            else {
              this.player.src = url;
              if(!play) {
                  this.player.play()
                   this.setState(oldState => ({
                        'clicked':oldState.clicked,
                        'artists':oldState.artists,
                        'track_names':oldState.track_names,
                        'images':oldState.images,
                        'previews':oldState.previews,
                        'play':true,
                        'current':url,
                        'track_ids':oldState.track_ids,
                        'username':oldState.username,
                        'disabled':oldState.disabled,
                        'in_favorites': oldState.in_favorites,
                        'notif': false
                    }));

                }
                else {
                    this.player.pause();
                    this.setState(oldState => ({
                        'clicked':oldState.clicked,
                        'artists':oldState.artists,
                        'track_names':oldState.track_names,
                        'images':oldState.images,
                        'previews':oldState.previews,
                        'play':false,
                        'current':oldState.url,
                        'track_ids':oldState.track_ids,
                        'username':oldState.username,
                        'disabled':oldState.disabled,
                        'in_favorites': oldState.in_favorites,
                        'notif':false
                    }));

                }
            }

        }
    }



        saveTrack = (track, index) => {
            let token = cookie.get('access_token');

            axios.get(`/api/track/save/${track}/${this.state['username']}/${token}`)
                    .then(res => {
                        this.added[track] = true;
                        var disabled_keys = this.state['disabled'];
                        disabled_keys[index] = true;
                        this.setState(oldState => ({
                        'clicked':oldState.clicked,
                        'artists':oldState.artists,
                        'track_names':oldState.track_names,
                        'images':oldState.images,
                        'previews':oldState.previews,
                        'play':oldState.play,
                        'current':oldState.url,
                        'track_ids':oldState.track_ids,
                        'username':oldState.username,
                        'disabled':disabled_keys,
                        'in_favorites': oldState.in_favorites,
                        'favorited': this.state.favorited,
                        'notif': true
                    }));



                    })
                    .catch(err => {

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
                    'clicked':oldState.clicked,
                    'artists':oldState.artists,
                    'track_names':oldState.track_names,
                    'images':oldState.images,
                    'previews':oldState.previews,
                    'play':oldState.play,
                    'current':oldState.url,
                    'track_ids':oldState.track_ids,
                    'username':oldState.username,
                    'disabled':disabled_keys,
                    'in_favorites': this.in_favorites,
                    'favorited': favs,
                    'notif': false
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
                        'clicked':oldState.clicked,
                        'artists':oldState.artists,
                        'track_names':oldState.track_names,
                        'images':oldState.images,
                        'previews':oldState.previews,
                        'play':oldState.play,
                        'current':oldState.url,
                        'track_ids':oldState.track_ids,
                        'username':oldState.username,
                        'disabled':disabled_keys,
                        'in_favorites': this.in_favorites,
                        'notif': false
                    }));
    
    
    
                    })
                    .catch(err => {
    
                        console.log("error :(");
                    })
    
            }




            handleClose = (event, reason) => {
                 this.setState(oldState => ({
                        'clicked':oldState.clicked,
                        'artists':oldState.artists,
                        'track_names':oldState.track_names,
                        'images':oldState.images,
                        'previews':oldState.previews,
                        'play':false,
                        'current':oldState.url,
                        'track_ids':oldState.track_ids,
                        'username':oldState.username,
                        'disabled':oldState.disabled,
                        'in_favorites': oldState.in_favorites,
                        'notif': false
                  }));


            };




            render() {



            return(

        <div style={{backgroundColor: 'white', overflow: 'scroll'}}>

            <h2 style={{fontWeight: '300', marginTop: '20px', marginBottom: '0px'}}>Related Tracks</h2>
            <List>
                {this.state.clicked &&
                    this.state.artists.map((artist, index) =>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt="Image" src={this.state.images[index]} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={this.state.track_names[index]}
                            secondary={this.state.artists[index]}
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

}

export default RelatedTracks;