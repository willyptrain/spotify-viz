import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import DeleteIcon from '@material-ui/icons/Delete';
import cookie from 'js-cookie';
import axios from 'axios';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import './playlistbuttons.css';

class PlaylistButtons extends React.Component{
    constructor(props) {
        super(props);
        this.nextProps = this.props;
        this.state = {hasPlaylist: false, playlistId:null, playlistUrl: null};


    }

    componentWillReceiveProps(nextProps) {
            let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.nextProps = nextProps
            this.componentDidMount();

        }
    }

    componentDidMount() {
        this.userHasPlaylist();
        this.getUserPlaylist();
    }

    userHasPlaylist = () => {
        let token = cookie.get('access_token');
            axios.get(`/api/user_has_playlist/${token}`)
            .then(res => {
                fetch = res.data;
                console.log(res.data);
                this.setState({
                    'hasPlaylist': fetch.hasPlaylist,
                });

        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    } 
    getUserPlaylist = () => {
        let token = cookie.get('access_token');
            axios.get(`/api/get_favorites_playlist_url/${token}`)
            .then(res => {
                fetch = res.data;
                console.log(res.data);
                this.setState({
                    'playlistUrl':fetch.url
                });

        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    } 

    deleteFavoritesPlaylist = () => {
        let token = cookie.get('access_token');
        axios.get(`/api/delete_favorites_playlist/${token}`)
            .then(res => {
                this.setState({
                    hasPlaylist: false
                });

        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }

    createFavoritesPlaylist = () => {
        let token = cookie.get('access_token');
        axios.get(`/api/create_playlist/${token}`)
            .then(res => {
                this.setState({
                    'hasPlaylist': true,
                    'playlistId': res.data.playlist_id,
                    'playlistUrl': this.getUserPlaylist()
                });

        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }

    clearFavorites = () => {
        let token = cookie.get('access_token');
        axios.get(`/api/clear_favorites/${token}`)
            .then(res => {
                this.setState({
                    
                });

        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }

    clearFavsHelper = () => {
        this.clearFavorites();
        window.location.reload();
    }
    render(){
        return(
            <div>
            <div id='black-buttons' align="right" style={{marginRight: '20px'}}>
            {!this.state.hasPlaylist && 
            <Button onClick={() => this.createFavoritesPlaylist()} variant="contained" className="black-buttons"style={{color: "#DFE0E3", backgroundColor: "#313331"}} > <SyncIcon color="white"/>Sync to Spotify Playlist</Button>}

            {this.state.hasPlaylist &&   <Button style={{color: "#DFE0E3", backgroundColor: "#313331"}} onClick={()=> window.open(this.state.playlistUrl, "_blank")} variant="contained">View Playlist</Button>}
            {this.state.hasPlaylist && <Button onClick={() => this.deleteFavoritesPlaylist()} variant="contained" style={{color: "#DFE0E3", backgroundColor: "red"}}> <DeleteIcon color="white"/>Delete Spotify Playlist</Button>}</div>
            <Button style={{color: "#DFE0E3", backgroundColor: "#313331"}} variant="contained" onClick={() => this.clearFavsHelper()} className="black-buttons"> Clear Favorites</Button>
            
            </div>
        )
    }
}

export default PlaylistButtons;