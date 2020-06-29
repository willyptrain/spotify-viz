import cookie from 'js-cookie';
import axios from 'axios';
import { List, Image } from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import './userinfo.css';
import { Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import {FetchCurrentlyPlaying} from './FetchCurrentlyPlaying';
import { Doughnut,Radar } from 'react-chartjs-2';


export default function GenreChart(data) {
    let genre_info = data.data;
    let range = data.range;
    let chart = data.chart;
    let chartReference = React.createRef();

//    'data': [{
//                    labels: fetch.labels,
//                    datasets: [{
//                        'data': fetch.scores,
//                        'labels': fetch.labels,
//                        'backgroundColor': fetch.colors
//                    }]
//                }]
//long_genre_scores: (5) [76, 61, 51, 47, 41]
//long_term_genres:
//
    if(data.range == "short") {
        var data = [{
            labels: data.data['short_term_genres'].slice(0,5),
            datasets: [{
                data: data.data['short_genre_scores'].slice(0,5),
                labels: data.data['short_term_genres'].slice(0,5),
                backgroundColor: chart == "doughnut" ? ['#f1a5ba', '#f5b565', '#fbd981', '#93dcdc', '#6cb8ee'] : 'rgba(108, 184, 238,0.6)'
            }]
        }]
    }
    else if(data.range == "long") {
        var data = [{
            labels: data.data['long_term_genres'].slice(0,5),
            datasets: [{
                data: data.data['long_genre_scores'].slice(0,5),
                labels:  data.data['long_term_genres'].slice(0,5),
                 backgroundColor: chart == "doughnut" ? ['#f1a5ba', '#f5b565', '#fbd981', '#93dcdc', '#6cb8ee'] : 'rgba(108, 184, 238,0.6)'
            }],
        }]
    }
    let token = cookie.get('access_token');
    var titles = {
        'short': 'Most Recent Genres',
        'long': 'All Time Genres'
    }
    var title = titles[range];

    return(
                <div>
                { chart == "doughnut" &&
                    <Doughnut ref={chartReference}
                                    data={data[0]} options={{
                                        title: {
                                            display: true,
                                            text: title,
                                            fontFamily: 'Montserrat',
                                            fontSize: '18'
                                        },
                                        legend: {
                                            position: "bottom"
                                        },

                                    }} />

                }
                { chart == "radar" &&
                     <Radar ref={chartReference}
                                    data={data[0]} options={{
                                    scale: {
                                        angleLines: {
                                            display: false
                                        },
                                        ticks: {
                                            suggestedMin: 0,
                                            suggestedMax: 0,
                                            display: false
                                        }
                                    },
                                    title: {
                                            display: true,
                                            text: title,
                                            fontFamily: 'Montserrat',
                                            fontSize: '18'
                                        },
                                    legend: {
                                        position: "bottom",
                                        display: false
                                    },
                                    }

                                    } />

                }

                </div>

    );
}