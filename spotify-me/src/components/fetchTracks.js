import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';

/*
export function FetchTracks() {
    const [state, setState] = useState({track_list: null})
    let token = cookie.get('access_token');
    useEffect(() => {
        setState({track_list: state.track_list})
        fetch(`http://localhost:5000/user/short_term/${token}`).then(res => res.json()).then(data => {
           let tl = [];
          for (let i = 0; i < 5; i++) {
            tl.push(data.top_tracks[i].artist)
            setState({track_list: state.track_list.push({
                artist: data.top_tracks[i].artist,
            })});
        }
        }).then();
      }, [setState]);
    console.log(state);
    return state;
};
*/
export function FetchTracks(time_period){
    console.log(time_period)
    const [tracks, setTracks] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user/${time_period}/${token}`)
        .then(res => {
            console.log(res)
            setTracks(res.data.top_tracks)
        })
        .catch(err => {
            console.log(err)
        }, [])
    })
    return(
        <div>
            <ul>
            {
                tracks.map(track => <li key={track.track_name}>{track.track_name}</li>)
            }
            </ul>
        </div>
    );
}