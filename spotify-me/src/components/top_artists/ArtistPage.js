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
import './artists.css'
import { Link } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types'
import { Doughnut } from 'react-chartjs-2';
import 'react-circular-progressbar/dist/styles.css';





class ArtistPage extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props);

        this.chartReference = React.createRef();

        this.state = {value: 'short_term', clicked: false,
                            data: [], artist:this.props.artist};





    }

    componentWillReceiveProps(nextProps) {
            let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.componentDidMount();

        }
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        axios.get(`http://localhost:5000/artist/${this.props.data.artist.uri}/${token}`)
        .then(res => {
            fetch = res.data;
            console.log(fetch);
                this.setState(oldState => ({
                    'clicked': true,
                    'artist_info':fetch,

                }));



        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }

            render() {


           if(this.state.artist_info) {
                       const genres = this.state.artist_info.genres;

            return(

        <div style={{backgroundColor: 'white'}}>
            <Card>
                <CardContent>
                    <img style={{height:'250px',width:'250px'}} src={this.state.artist_info.images[0].url} />
                    <h2>{this.state.artist_info.name.toUpperCase()}</h2>
                    <div class="genre-container">
                    <h3>Genres: </h3>
                        {genres.map((genre) => <p>{genre[0].toUpperCase() + genre.substr(1)}, </p>)}
                    </div>
                </CardContent>

            </Card>

              </div>
            );

            }
            return (<div><h4>Loading...</h4></div>);
            }

}

export default ArtistPage;
