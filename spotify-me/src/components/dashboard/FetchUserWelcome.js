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



export default function FetchUserWelcome(data) {
    console.log(data.data)
    const [ info, setInfo ] = useState([]);
    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`http://localhost:5000/user_info/${token}/`)
        .then(res => {
            console.log(res.data)
            setInfo(res.data[0].image_url);
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
                    <Image src={info} size='medium' circular centered/>
        </div>
    );
}