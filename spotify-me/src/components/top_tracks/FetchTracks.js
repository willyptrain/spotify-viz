import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image } from 'semantic-ui-react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import './tracks.css'
import Badge from '@material-ui/core/Badge';



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

<div container>
    <Grid container className="grid-container"
  alignItems="center"
  justify="center" spacing={0}>

         {
        tracks.map((track,index) =>
        <Grid item xs={6} sm={3}>
            <Card className="track-card">
                    <CardMedia className="track-img" image={track.image}></CardMedia>
                    <CardContent className="track-info">
                        <Typography className="music-title" gutterBottom variant="h6" component="h6">{index+1}. {track.track_name} by {track.artist}</Typography>
                    </CardContent>
            </Card>
         </Grid>

        )}

      </Grid>
      </div>
    );
}
