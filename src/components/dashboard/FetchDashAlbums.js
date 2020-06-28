import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';

function albums_page(e) {
    e.preventDefault();
    window.location = '/top_albums';
  }

export function FetchDashAlbums(data) {
    console.log(data.data)
    const [albums, setAlbums] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user_albums/${data.data}/${token}/5/`)
        .then(res => {
            console.log(res.data)
            setAlbums(res.data.albums)
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
                albums.map(album =>
        <List.Item>
          <Image avatar  src={album.images[0].url} circular/>
          <List.Content>
            <List.Header as='a'>{album.name}</List.Header>
            <List.Description>
              by{' '}
              <a>
                <b>{album.artists[0].name}</b>
              </a>{' '}
            </List.Description>
          </List.Content>
        </List.Item>)
                }
        </List>
        <Button primary content="View more..." onClick={albums_page} />
        </div>
    );
}