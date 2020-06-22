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
import './artists.css';
import { Link } from 'react-router-dom';



export function FetchArtists(data) {
    console.log(data.data)
    const [artists, setArtists] = useState([]);
    const isCardFunction = (data.handleChange != null);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user_artists/${data.data}/${token}`)
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
    <Grid container className="grid-container"
  alignItems="center"
  justify="center" spacing={0}>

         {
        artists.map((artist,index) =>
            <Grid item xs={6} sm={3}>
            {isCardFunction &&
            <Card onClick={() => data.handleChange(artist)} className="topartists-card">
                    <CardMedia className="topartists-img" image={artist.image}></CardMedia>
                    <CardContent className="topartists-info">
                        <Typography className="music-title" gutterBottom variant="h6" component="h6">{index+1}. {artist.artist_name}</Typography>
                    </CardContent>
            </Card>
            }
         </Grid>
        )}

      </Grid>
      </div>
    );
}
