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
import './tracks.css'
import { Link } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import ArtistPage from '../artist/ArtistPage.js'
import TopTracks from './TopTracks.js';
import PropTypes from 'prop-types'
import { Doughnut, Radar, HorizontalBar } from 'react-chartjs-2';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import RelatedTracks from './RelatedTracks.js';





class TrackGraph extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props);

            this.chartReference = React.createRef();

            this.state = {value: 'short_term', clicked: false,
                            data: null, artist:this.props.artist};


    }

    componentWillReceiveProps(nextProps) {
            let token = cookie.get('access_token');

        if(this.props != nextProps) {
            this.componentDidMount();

        }
    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        console.log(this.props.artist);
        axios.get(`http://localhost:5000/track/${this.props.artist.uri}/${token}`)
        .then(res => {
            fetch = res.data;
            console.log(fetch);
            this.setState({
                'clicked': true,
                'dataset': {
                    data: fetch.scores,
                    labels: fetch.labels,
                    backgroundColor: fetch.colors
                },
                'data': [{
                    labels: fetch.labels,
                    datasets: [{
                        'data': fetch.scores,
                        'labels': fetch.labels,
                        'backgroundColor': fetch.colors
                    }]
                }]

            });
            this.render();


        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }






            render() {
            return(

        <div>




        <div style={{backgroundColor: 'white'}}>

        <Card>
            {this.state.clicked &&
            <Card class="track-chart-container">
                <CardHeader
                    title={this.props.artist.track_name}
                    subheader={this.props.artist.artist}
                ></CardHeader>
                <CardContent>
                    <HorizontalBar ref={this.chartReference}
                                    data={this.state.data[0]} options={{
                                        legend: {
                                            display: false
                                        }


                                    }}  />
                </CardContent>

            </Card>
            }
            {this.state.clicked &&
            <div>
                <Card>
                    <RelatedTracks {...this.props} artist={this.props.artist} />
                </Card>
            </div>
            }

             </Card>
              </div>
             </div>
            );

            }

}

export default TrackGraph;