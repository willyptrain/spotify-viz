import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import {BrowserView, MobileView} from 'react-device-detect';
import Carousel from 'react-material-ui-carousel'
import 'react-multi-carousel/lib/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './artist.css'
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Doughnut, Radar } from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import ItemsCarousel from 'react-items-carousel';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import "font-awesome/css/font-awesome.css";
import Icon from '@material-ui/core/Icon';




class ArtistPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
        this.chartReference = React.createRef();
        console.log(this.props);
        this.onClose = this.props.onClose;
        console.log(this.props.onClose);
        this.artist_uri = this.props.id.id;
        this.token = cookie.get('access_token');


        this.responsive = {
          desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30
  }
        };


    }

    async componentDidMount()  {
        axios.get(`http://localhost:5000/artist/${this.artist_uri}/${this.token}`)
        .then(res => {
            console.log(res.data);
            var artist_data = res.data.artist_info;
            var album_info = res.data.albums;
            console.log({
                'external_url':artist_data.external_urls.spotify,
                'followers': artist_data.followers.total,
                'genres': artist_data.genres,
                'images':artist_data.images,
                'name': artist_data.name,
                'popularity':artist_data.popularity,
                'albums':album_info.items,
                'genre_data':res.data.genre_data,
                'dataset': {
                    data: res.data.genre_data.scores,
                    labels: res.data.genre_data.labels,
                    backgroundColor: res.data.genre_data.colors
                },
                'data': [{
                    labels: res.data.genre_data.labels,
                    datasets: [{
                        'data': res.data.genre_data.scores,
                        'labels': res.data.genre_data.labels,
                        'backgroundColor': res.data.genre_data.colors
                    }]
                }]

            });
            this.setState({
                'external_url':artist_data.external_urls.spotify,
                'followers': artist_data.followers.total,
                'genres': artist_data.genres,
                'images':artist_data.images,
                'name': artist_data.name,
                'popularity':artist_data.popularity,
                'albums':album_info.items,
                'genre_data':res.data.genre_data,
                'dataset': {
                    data: res.data.genre_data.scores,
                    labels: res.data.genre_data.labels,
                    backgroundColor: ['rgba(0,0,0,0.5)']
                },
                'data': [{
                    labels: res.data.genre_data.labels,
                    datasets: [{
                        'data': res.data.genre_data.scores,
                        'labels': res.data.genre_data.labels,
                        'backgroundColor': ['rgba(90,240,159,0.5)']
                    }]
                }]

            });
            console.log(this.state);
        })
        .catch(err => {
            console.log(err);
        })
    }

    handleClose() {
        this.onClose();

    }


    render(){


        const breakPoints = [
          { width: 1, itemsToShow: 1 },
          { width: 550, itemsToShow: 2 },
          { width: 768, itemsToShow: 3 },
          { width: 1200, itemsToShow: 4 }
        ];

        if('external_url' in this.state) {

            var settings = {
              autoplay: true,
              dots: false,
              infinite: true,
              slidesToShow: 5,
              slidesToScroll: 1,
              speed: 2000,
              autoplaySpeed: 0

            };


            return(
            <>
            <BrowserView style={{height:'100%'}}>
                <Grid style={{height:'100%', position:'relative', left:'0px', width:'100%'}} container className="grid-container">
                <Grid style={{height:'100%'}} item sm={10}>
                    <Card className="artist-card">
                      <Grid container className='artist-top-container'>
                        <Grid style={{height:'100%'}} item sm={6}>
                           <div style={{height:'100%'}} className="artist-img-container">
                                <a href={this.state['external_url']}>
                                    <img className="artist-img" src={this.state['images'][0]['url']}  />
                                </a>
                            </div>
                        </Grid>

                        <Grid style={{height:'100%'}} item sm={6}>
                             <div className="artist-info">
                            <IconButton className="exit-artist-modal" onClick={() => this.handleClose()}>
                                <Icon onClick={() => this.handleClose()} className="fa fa-times" />
                            </IconButton>
                            <div className="artist-name-container">
                                <Typography className="artist-name" style={{fontFamily: 'Montserrat'}}
                                        gutterBottom variant="h3" component="h3">{this.state['name']}</Typography>
                            </div>
                            <div className="genre-doughnut">
                                <Radar ref={this.chartReference}
                                data={this.state.data[0]} options={{
                                    rotation: Math.PI,
                                    circumference: Math.PI,
                                       title: {
                                            display: true,
                                            position: "center",
                                            text: 'Upcoming Meetings' },
                                        scale: {
                        ticks: {
                            display: false
                        },
                        yAxis: {
                            display: false
                        },
                        pointLabels: {
                            fontSize: 16,
                            fontColor: '#111111',
                            fontFamily: "'Montserrat','Roboto'"
                        }
                    },
                    legend: {
                        display: false
                    },
                    radius: {
                        fontSize: 24
                    }
                                }} />
                            </div>
                        </div>
                        </Grid>
                      </Grid>
                      <Grid container alignItems="center" justify="center" >
                        <Grid style={{height:'100%'}} item sm={11}>
                            <div>
                                <Paper className='carousel-bgd' elevation={3}>
                                    <Slider {...settings}>

                                    {

                                        this.state.albums.map((album) =>
                                            <img className="album-carousel-item" src={album.images[0].url}
                                                  />

                                        )


                                    }
                                    </Slider>
                                </Paper>
                            </div>
                        </Grid>
                      </Grid>
                 </Card>
               </Grid>
               </Grid>


            </BrowserView>


            <MobileView>
                <Grid container className="grid-container">
                <Grid item xs={12}>
                    <div className="artist-img">
                        <a href={this.state['external_url']}>
                            <img src={this.state['images'][0]['url']} height={this.state['images'][1]['height']} width={this.state['images'][1]['width']} />
                        </a>
                    </div>
               </Grid>
               <p>{this.state['followers']}</p>
               </Grid>
            </MobileView>

         </>



            );
        }
        else {
            return (<p></p>);
        }
    }
}

export default ArtistPage;
