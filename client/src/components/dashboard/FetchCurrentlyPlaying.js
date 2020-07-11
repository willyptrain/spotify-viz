import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';
import { Typography } from '@material-ui/core';

export function FetchCurrentlyPlaying() {
    const [curSong, setCurSong] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`/api/user/currently_playing/${token}/`)
        .then(res => {
            console.log(res.data)
            setCurSong(res.data)
        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })
    }, [])
    return(
        <div>
        <List size="mini">
            {
                    curSong.map(song =>
                        <Typography align="left"><b>Right now</b>, you're listening to <b>{song.name}</b> by <b>{song.artist}</b> from the album <b>{song.album}</b>. </Typography>
                    )
                }
        </List>
        </div>
    );
}