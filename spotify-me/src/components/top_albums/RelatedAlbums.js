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
                'track_names':fetch.track_names
            })
            console.log(fetch);
        })

        .catch(err => {
            console.log('error :(')
            console.log(err)
        })


    }






            render() {

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

                    </ListItem>
                    <Divider />
                    </div>
                )
            }
            </List>
        </CardContent>
            </Card>
              </div>
            );

            }
            return (<div></div>);
            }


}

export default RelatedAlbums;

