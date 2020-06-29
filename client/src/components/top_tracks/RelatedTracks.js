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

            this.added = {};
            this.chartReference = React.createRef();

            this.state = {value: 'short_term', clicked: false,
                            data: null, artist:this.props.artist, play: false, notif: false};


    }

    componentWillReceiveProps(nextProps) {
            let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.componentDidMount();

        }
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        axios.get(`http://localhost:5000/related_tracks/${this.props.artist.id}/${token}`)
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
                'notif': false
            })

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
                    'notif': false

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
                        'disabled':oldState.disabled
                    }));

                }
            }

        }
    }



        saveTrack = (track, index) => {
            let token = cookie.get('access_token');

            axios.get(`http://localhost:5000/track/save/${track}/${this.state['username']}/${token}`)
                    .then(res => {
                        this.added[track] = true;
                        var disabled_keys = this.state['disabled'];
                        disabled_keys[index] = true
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
                        'notif': true
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