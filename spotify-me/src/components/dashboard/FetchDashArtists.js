import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';

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
        <List size="mini">
            {
                artists.map(artist =>
        <List.Item>
          <Image avatar  src={artist.image} circular/>
          <List.Content>
            <List.Header as='a'>{artist.artist_name}</List.Header>
            <List.Description>
            </List.Description>
          </List.Content>
        </List.Item>)
                }
        </List>
        <Button primary content="View more..." onClick={artists_page} />
        </div>
    );
}