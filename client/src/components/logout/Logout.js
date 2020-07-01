import {logout} from '../../util/auth.js';
import React, {useEffect, useState} from 'react';


export default function Logout(userInfo) {
    console.log(userInfo);

    useEffect(() => {
        logout();


    });


    return(
        <div style={{ marginTop: `64px`, marginLeft: '84px'}}>
        <h1 style={{fontFamily: 'Montserrat !important'}}>You are now logged out.</h1>
        <p><a style={{fontFamily: 'Montserrat !important'}} href="/">Click here to return to the home page.</a></p>
        </div>
    );
}
