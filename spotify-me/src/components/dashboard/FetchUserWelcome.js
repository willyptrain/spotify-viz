import axios from 'axios';
import { List, Image } from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import cookie from 'js-cookie';
import './userinfo.css';
import { Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import {FetchCurrentlyPlaying} from './FetchCurrentlyPlaying';



export default function FetchUserWelcome(data) {
    console.log(data.data)
    const [ info, setInfo ] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user_info/${token}/`)
        .then(res => {
            console.log(res.data)
            setInfo(res.data);
        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })
    }, [])

    console.log(info);
    console.log();
    return(
        <div>
            {
            info.map( user_info =>
                <div>
                    <Image src={user_info.image_url} size='medium' circular centered bordered/>
                    <Box m={3}>
                    <Typography align="left"><b>Recently</b>, you've been listening to <b>{user_info.short_term_genres[0]}</b>, <b>{user_info.short_term_genres[1]}</b>, and <b>{user_info.short_term_genres[2]}</b>.
                    </Typography>
                    <Typography align="left"><b>Typically</b>, you listen to <b>{user_info.long_term_genres[2]}</b>, <b>{user_info.long_term_genres[3]}</b>, and <b>{user_info.long_term_genres[4]}</b>.</Typography>
                    <FetchCurrentlyPlaying/>
                    </Box>
                </div>
            )}
        </div>
    );
}