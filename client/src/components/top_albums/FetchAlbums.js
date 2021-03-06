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
    const [albums, setAlbums] = useState([]);
    const isCardFunction = (data.handleChange != null);
    const scroll = data.scroll ? 'scroll' : 'hidden';
    const spacer = data.scroll ? 3 : 2;


    let token = cookie.get('access_token');
    useEffect(() => {
        let isMounted = true;
        axios.get(`/api/user_albums/${data.data}/${token}/50`)
        .then(res => {
            if(isMounted) {
                console.log(res.data)
                setAlbums(res.data.albums)
            }

        })

        return () => { isMounted = false };
    }, [data.data])



    return(

<div style={{overflow: scroll, height: 'auto'}}>

            <Grid container className="grid-container"
          alignItems="center"
          justify="center" spacing={0}>

                 {
                albums.map((album,index) =>
                    <Grid item xs={6} sm={spacer} md={spacer} lg={spacer}>
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
