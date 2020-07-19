import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';



export default function AddToPlaylist(data) {

    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`/api/save_to_playlist/${data.data}/${token}/`)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }, [data.data])
    return(
        <h>yo</h>
    );

}