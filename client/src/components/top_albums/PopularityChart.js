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
import Modal from '@material-ui/core/Modal';
import TopAlbums from './TopAlbums.js';
import PropTypes from 'prop-types'
import { Doughnut } from 'react-chartjs-2';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';





class PopularityChart extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props);

            this.chartReference = React.createRef();

            this.state = {value: 'short_term', clicked: false,
                            data: [], artist:this.props.artist, feature:'valence'};





    }

    componentWillReceiveProps(nextProps) {
            let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.componentDidMount();

        }
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        axios.get(`http://localhost:5000/album/${this.props.artist.uri}/${token}`)
        .then(res => {
            fetch = res.data;
            console.log(fetch);
                this.setState(oldState => ({
                    'clicked': true,
                    'album_info':fetch.album_info,



                }));





            console.log(this.state);



        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }

            render() {


           if(this.state.album_info) {
            return(

        <div style={{backgroundColor: 'white'}}>

        <h6>Popularity</h6>
<CircularProgressbar value={this.state.album_info.popularity} text={`${this.state.album_info.popularity}`} strokeWidth={12} />;

              </div>
            );

            }
            return (<div><h4>Loading...</h4></div>);
            }

}

export default PopularityChart;
