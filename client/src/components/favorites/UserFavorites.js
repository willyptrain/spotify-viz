import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import { Sidebar } from 'semantic-ui-react';
import {FavTracks} from './FavTracks';


class UserFavorites extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return(
            <FavTracks {...this.state}/>
        );
    }
}

export default UserFavorites;
