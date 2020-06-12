import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image } from 'semantic-ui-react';

export function FetchDashTracks(data) {
    console.log(data.data)
    const [tracks, setTracks] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user/${data.data}/${token}`)
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
        <List>
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
        </div>
    );
}