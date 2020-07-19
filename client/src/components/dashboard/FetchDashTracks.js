import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import './userinfo.css';
import StarIcon from '@material-ui/icons/Star';

function tracks_page(e) {
  e.preventDefault();
  window.location = '/top_tracks';
}

export function FetchDashTracks(data) {
    console.log(data.data)
    const [tracks, setTracks] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`/api/user/${data.data}/${token}/15/`)
        .then(res => {
            console.log(res.data.top_tracks)
            setTracks(res.data.top_tracks)
        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })
    }, [data.data])
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
        <Button primary content="View more..." onClick={tracks_page} />
        </div>
    );
}

