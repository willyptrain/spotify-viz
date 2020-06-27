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
import './topalbums.css'
import { Link } from 'react-router-dom';



export function FetchAlbums(data) {
    console.log(data);
    const [albums, setAlbums] = useState([]);
        const isCardFunction = (data.handleChange != null);


    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user_albums/${data.data}/${token}/10`)
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

            <Grid container className="grid-container"
          alignItems="center"
          justify="center" spacing={0}>

                 {
                albums.map((album,index) =>
                    <Grid item xs={6} sm={2} md={2} lg={2}>
                    {isCardFunction &&
                        <Card onClick={() => data.handleChange(album)} className="track-card">
                            <CardMedia className="topalbums-img" image={album.images[0].url}></CardMedia>
                            <CardContent className="topalbums-info">
                                <Typography className="music-title" gutterBottom variant="h6" component="h6">{index+1}. {album.name} by {album.artists[0].name}</Typography>
                            </CardContent>
                    </Card>
                    }

                 </Grid>
                )}

              </Grid>


      </div>
    );
}
