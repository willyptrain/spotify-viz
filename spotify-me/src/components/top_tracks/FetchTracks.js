import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';

export function FetchTracks(data) {
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
            <ul>
            {
                tracks.map(track => <li key={track.track_name}>{track.track_name} by {track.artist}</li>)
            }
            </ul>
        </div>
    );
}
