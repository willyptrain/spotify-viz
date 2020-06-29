import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';

function artists_page(e) {
    e.preventDefault();
    window.location = '/top_artists';
  }

export function FetchDashArtists(data) {
    console.log(data.data)
    const [artists, setArtists] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user_artists/${data.data}/${token}/5/`)
        .then(res => {
            console.log(res.data)
            setArtists(res.data.top_artists)
        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }, [data.data])
    return(
        <div>
        <h2>Top Artists</h2>
        <List size="mini">
            {
                artists.map(artist =>
                    <ListItem>
                       <ListItemAvatar>
                           <Avatar alt="Image" src={artist.image}/>
                      </ListItemAvatar>

                        <ListItemText
                                            primary={artist.artist_name}
                                         />
                    </ListItem>)
                }
        </List>
        <Button primary content="View more..." onClick={artists_page} />
        </div>
    );
}
