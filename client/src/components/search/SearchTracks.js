import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Distribution, Box, Text} from 'grommet';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import axios from 'axios';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import './search.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


class SearchTracks extends React.Component{

    constructor(props) {
        super(props);
        console.log(props.id.term);
        this.state = {id: props.id.term, tracks: []};
    }

    async componentDidMount() {
        let token = cookie.get('access_token');

        axios.get(`/api/track/search/${this.state['id']}/${token}`)
        .then(res => {
            console.log(res.data['tracks'].items)
            this.setState(oldState => ({
                id: oldState.id,
                tracks: res.data['tracks'].items
            }));
        })
        .catch(err => {
            console.log("error :(")
            console.log(err)
        })
    }


    render() {
        return (
            <div style={{position: 'relative', marginLeft: '84px', width:'90%'}}>
                <h1 className="search-header">Search Results</h1>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell size="medium" className="table-header" classes="table-header" align="left">Track Name</TableCell>
                        <TableCell size="medium" className="table-header" classes="table-header" align="left">Artist</TableCell>
                        <TableCell size="medium" className="table-header" classes="table-header" align="right">Duration</TableCell>
                        <TableCell size="medium" className="table-header" classes="table-header" align="right">Popularity</TableCell>
                        <TableCell size="medium" className="table-header" classes="table-header" align="right">Genre</TableCell>
                      </TableRow>
                    </TableHead>

                    {this.state['tracks'] && this.state['tracks'].map((track,index) =>
                        <TableRow key={track['name']}>
              <TableCell className="table-results" component="th" scope="row">
                <div className="avatar-head">
                    <Avatar className="table-avatar" src={track['album']['images'][0]['url']} /> <h6 className="track-name">{track.name}</h6>
                </div>
              </TableCell>
              <TableCell className="table-results" align="left">{track['artists'][0]['name']}</TableCell>
              <TableCell className="table-results" align="right">{track['duration']/600000}</TableCell>
              <TableCell className="table-results" align="right">{track['popularity']}</TableCell>
              <TableCell className="table-results" align="right">genres</TableCell>
            </TableRow>




                     )}

               </Table>
               </TableContainer>


            </div>

        );

    }


}

export default SearchTracks;
//<ListItem>
//                            <ListItemAvatar>
//                              <Avatar
//                                alt="Album Image"
//                                src={track['album']['images'][0]['url']}
//                              />
//                            </ListItemAvatar>
//                            <ListItemText primary={track['name']} />
//
//                        </ListItem>