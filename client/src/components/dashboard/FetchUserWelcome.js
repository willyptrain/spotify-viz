import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image } from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import './userinfo.css';
import { Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import {FetchCurrentlyPlaying} from './FetchCurrentlyPlaying';



export default function FetchUserWelcome(data) {
    let user_info = data.data;
    let token = cookie.get('access_token');


    console.log(user_info);

    return(
                <div style={{height: '100%'}}>
                    <CardMedia
                      component="img"
                      alt="ProfileImage"
                      height="300"
                      style={{objectFit: 'cover', height: '80%'}}
                      image={user_info.image_url}
                      title={user_info.username}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {user_info.username.slice(0,1).toUpperCase() + user_info.username.slice(1)}
                      </Typography>

                      <Typography component="p">
                        Followers: {user_info['followers']['total']}
                      </Typography>
                    </CardContent>
                </div>

    );
}