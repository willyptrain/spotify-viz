import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';

function tracks_page(e) {
  e.preventDefault();
  window.location = '/top_tracks';
}

export function FavTracks(data) {
    console.log(data.data)
    const [tracks, setTracks] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`/api/fetch_fav_tracks/${token}/`)
        .then(res => {
            console.log(res.data.fav_tracks)
            setTracks(res.data.fav_tracks)
        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })
    }, [])
    return(
        <div>
        <h2 class="list-title" style={{marginTop: '10px'}}>Top Tracks</h2>
        <List size="mini">
            {
                tracks.map(track =>
        <ListItem>
           <ListItemAvatar>
               <Avatar alt="Image" src={track.image}/>
          </ListItemAvatar>

            <ListItemText
                                primary={track.track_name}
                            secondary={track.artist}
                             />
        </ListItem>)
                }
        </List>
        </div>
    );
}

