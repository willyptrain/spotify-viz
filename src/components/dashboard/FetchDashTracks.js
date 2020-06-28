import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';

function tracks_page(e) {
  e.preventDefault();
  window.location = '/top_tracks';
}

export function FetchDashTracks(data) {
    console.log(data.data)
    const [tracks, setTracks] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user/${data.data}/${token}/5/`)
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
        <List size="mini">
            {
                tracks.map(track =>
        <List.Item>
          <Image avatar  src={track.image} circular/>
          <List.Content>
            <List.Header as='a'>{track.track_name}</List.Header>
            <List.Description>
              by{' '}
              <a>
                <b>{track.artist}</b>
              </a>{' '}
            </List.Description>
          </List.Content>
        </List.Item>)
                }
        </List>
        <Button primary content="View more..." onClick={tracks_page} />
        </div>
    );
}