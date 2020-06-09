import React from "react";
import {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { logout } from '../../util/auth';
import NavBar from '../common/navbar/Navbar';
import { Album } from 'react-spotify-api';
import { SpotifyApiContext} from 'react-spotify-api';
import Mappings from './GenreMappings'




class GenreGraphs extends React.Component{

    constructor(props) {
        super(props);
        console.log(this.props.userInfo.display_name);
      }
    async componentDidMount() {
        const { userInfo, history } = this.props;
                console.log(this.props);

    }
    logout = async () => {
        const res = await logout();
            if (res.status === 200) {
            }
        }

    render(){
        const labels = <Mappings data={this.props.userInfo.display_name}/>;
        return(
            <div>
            <h1>Graphs</h1>
            {labels}
            </div>

        );

    }
}

export default GenreGraphs;
