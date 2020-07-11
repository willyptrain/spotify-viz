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
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Slider from "react-slick";





class ArtistPage extends React.Component {

    constructor(props) {
        super(props);

        this.chartReference = React.createRef();
        this.nextProps = this.props;
        this.state = {value: 'short_term', clicked: false,
                            data: [], artist:this.props.artist};





    }

    componentWillReceiveProps(nextProps) {
            let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.nextProps = nextProps;
            this.componentDidMount();

        }
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        console.log(this.nextProps)
        axios.get(`/api/artist/${this.nextProps.artist.uri}/${token}`)
        .then(res => {
            fetch = res.data;
                this.setState(oldState => ({
                    'clicked': true,
                    'artist_info':fetch.info,
                    'albums':fetch.albums.items
                }));



        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }

            render() {


            var settings = {
              autoplay: true,
              dots: false,
              infinite: true,
              slidesToShow: 3,
              slidesToScroll: 1,
              speed: 2000,
              autoplaySpeed: 0

            };

           if(this.state.artist_info) {
                       const genres = this.state.artist_info.genres;

            return(

        <div style={{backgroundColor: 'white'}}>
            <Card>
                <CardContent>

                        <img style={{height:'250px',width:'250px', borderRadius: '100%', boxShadow:'2px 2px 5px 0.1px black'}} src={this.state.artist_info.images[0].url} />
                    <h1>{this.state.artist_info.name.toUpperCase()}</h1>
                    <Grid container className="artist-grid-container">
                        <Grid item sm={12}>
                            <div class="genre-container">
                                <h4>Genres:</h4>
                                <p>&nbsp;{genres.slice(0,Math.min(genres.length,4)).join(", ")}</p>
                            </div>
                        </Grid>
                        <Grid item sm={12}>
                             <div class="genre-container" style={{backgroundColor: 'white'}}>
                                <h4>Popularity: </h4>
                                <p>&nbsp;{this.state.artist_info.popularity}</p>
                              </div>
                        </Grid>
                    </Grid>
                    <Slider {...settings}>

                                    {

                                        this.state.albums.map((album) =>
                                            <Card>
                                            <img className="album-carousel-item" src={album.images[0].url}
                                                  />
                                            </Card>

                                        )


                                    }
                    </Slider>
                </CardContent>

            </Card>

              </div>
            );

            }
            return (<div><h4>Loading...</h4></div>);
            }

}

export default ArtistPage;
//                                {genres.slice(0,Math.min(genres.length,4)).map((genre) => {genre[0].toUpperCase() + genre.substr(1)})}
//
