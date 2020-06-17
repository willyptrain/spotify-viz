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
import { Line } from 'react-chartjs-2';





class AlbumGraph extends React.Component {

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
            if(fetch.scores[this.state.feature].length > 1) {
                this.setState(oldState => ({
                    'clicked': true,
                    'album_info':fetch.album_info,
                    'data': [{
                        labels: fetch.names,
                        'datasets': [{
                            'data': fetch.scores[oldState.feature],
                            'labels': oldState.feature,
                            fill: true,
                            backgroundColor: "rgba(75,192,192,0.2)",
                            borderColor: "rgba(75,192,192,1)"
                        }]
                    }]


                }));
            }
            else {
                this.setState(oldState => ({
                    'clicked': true,
                    'album_info':fetch.album_info,
                    'data': null



                }));



            }
            console.log(this.state);



        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }






            render() {
           if(this.state.data) {
            return(

        <div style={{backgroundColor: 'white'}}>
        <Card>
            {this.state.clicked && (this.state.data[0]['datasets'][0]['data'].length > 1) &&
                <Line ref={this.chartReference}
                                data={this.state.data[0]} options={{
            title:{
              display:true,
              text:`${this.state.feature} score by track`,
              fontSize:20
            },
            legend:{
              display:false
            },
            plugins: {
            filler: {
                propagate: true
            }
        }
          }} />


           }

             </Card>
              </div>
            );

            }
            var info = this.state.album_info;
            return (<Card><CardContent><p>Cannot get graph for songs in {info.name}
                    but I can get popularity: {info.popularity}</p></CardContent></Card>);
            }

}

export default AlbumGraph;

//<this.ResponsiveHistogram
//        ariaLabel="My histogram of ..."
//        orientation="vertical"
//        cumulative={false}
//        normalized={true}
//        binCount={25}
//        valueAccessor={datum => datum}
//        binType="numeric"
//
//      >
//        <BarSeries
//          animated
//          rawData={this.state.data.data /* or binnedData={...} */}
//        />
//        <XAxis />
//        <YAxis />
//      </this.ResponsiveHistogram>