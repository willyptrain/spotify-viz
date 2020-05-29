import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';

function TopTracks() {
  const [topTrackTitle, setCurrentTrack] = useState(0);
  const [topTrackArtist, setCurrentArtist] = useState(0);
  let track_list = useState(0);
  const [state, setState] = useState({track_list: null});
  let token = cookie.get('access_token');
  useEffect(() => {
    setState({track_list: null});
    fetch(`http://localhost:5000/user/short_term/${token}`).then(res => res.json()).then(data => {
      setCurrentArtist(data.top_tracks[0]['artist']);
      setCurrentTrack(data.top_tracks[0]['track_name']);
      for (let i = 0; i < 5; i++) {
        track_list.push({
            artist: data.top_tracks[i].artist
        });
    console.log(track_list);
    }
    }).then(track_list => { setState({track_list: track_list});
    console.log(track_list);

    });
  }, []);
  return (
    <div className="TopTracks">
        <p>Your current top track is {topTrackTitle} by {topTrackArtist}.</p>
        <p>{track_list}</p>
        <div>
        {track_list.map((track, index) => (
            <p>Hello, {track.artist}!</p>
        ))}
        </div>
    </div>
  );
}
/*
class TopTracks extends React.Component{
    constructor(props){
        super(props);
        const tracks = [];

        this.state = { tracks };
    }
    render(){
        return(
            <div></div>
        );
    }
}
*/
export default TopTracks;