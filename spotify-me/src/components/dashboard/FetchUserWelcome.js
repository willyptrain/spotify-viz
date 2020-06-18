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
                    <Image src={user_info.image_url} size='medium' circular centered/>
                    <Typography>Recently you've been listening to {user_info.short_term_genres[0]}, {user_info.short_term_genres[1]}, and {user_info.short_term_genres[2]}.
                    </Typography>
                    <Typography>Typically, you listen to {user_info.long_term_genres[2]}, {user_info.long_term_genres[3]}, and {user_info.long_term_genres[4]}</Typography>
                </div>
            )}
        </div>
    );
}