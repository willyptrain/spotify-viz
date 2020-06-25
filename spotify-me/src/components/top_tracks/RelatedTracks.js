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
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';





class RelatedTracks extends React.Component {

    constructor(props) {
        super(props);

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
        axios.get(`http://localhost:5000/related_tracks/${this.props.artist.id}/${token}`)
        .then(res => {
            fetch = res.data;
            this.setState({
                'clicked':true,
                'artists':fetch.artists,
                'track_names':fetch.song_names,
                'images':fetch.images
            })



        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })


    }






            render() {
            return(

        <div style={{backgroundColor: 'white', overflow: 'scroll'}}>
        <Card>
            <h2 style={{float: 'left'}}>Related Tracks</h2>
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

                        </ListItem>
                    )
                }
            </List>
        </Card>
              </div>
            );

            }

}

export default RelatedTracks;