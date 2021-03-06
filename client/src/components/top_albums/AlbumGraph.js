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
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


class AlbumGraph extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props);
        this.nextProps = this.props;
            this.chartReference = React.createRef();
            this.mounted = false;
            this.state = {value: 'short_term', clicked: false,
                            data: [], artist:this.props.artist, feature:'valence', classes: null};





    }
      
    
    

     componentWillReceiveProps(nextProps) {

        let token = cookie.get('access_token');

        if(this.props.artist.uri != nextProps.artist.uri) {
            this.nextProps = nextProps;
            this.componentDidMount();

        }
    }



    async componentDidMount() {
        let token = cookie.get('access_token');
        this.mounted = true;
        axios.get(`/api/album/${this.nextProps.artist.uri}/${token}`)
        .then(res => {
            if(this.mounted){
                fetch = res.data;
                console.log(fetch.labels);
                this.chartReference = React.createRef();
                if(fetch.scores[this.state.feature].length > 1) {
                    this.setState(oldState => ({
                        'clicked': true,
                        'labels': fetch.labels,
                        'album_info':fetch.album_info,
                        'data': [{
                            labels: fetch.names,
                            'datasets': [{
                                'data': fetch.scores[oldState.feature],
                                'labels': oldState.feature,
                                fill: true,
                                backgroundColor: "rgba(75,192,192,0.2)",
                                borderColor: "rgba(75,192,192,1)"
                            }
                            ]
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

            }
            console.log(this.state);
                    return () => { this.mounted = false };



        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }

    changeFeature = () => {
        let token = cookie.get('access_token');
        this.mounted = true;
        axios.get(`/api/album/${this.nextProps.artist.uri}/${token}`)
        .then(res => {
            if(this.mounted){
                fetch = res.data;
                this.chartReference = React.createRef();
                if(fetch.scores[this.state.feature].length > 1) {
                    this.setState(oldState => ({
                        'clicked': true,
                        'labels': fetch.labels,
                        'album_info':fetch.album_info,
                        'data': [{
                            labels: fetch.names,
                            'datasets': [{
                                'data': fetch.scores[oldState.feature],
                                'labels': oldState.feature,
                                fill: true,
                                backgroundColor: "rgba(75,192,192,0.2)",
                                borderColor: "rgba(75,192,192,1)"
                            }
                            ]
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

            }
            console.log(this.state);
                    return () => { this.mounted = false };



        })
        .catch(err => {
            console.log('error :(')
            console.log(err)
        })
    }


    componentWillUnmount() {
        this.mounted = false;

    }

      
        handleChange = (event) => {
          this.setState({
              'feature' : event.target.value
          })
          this.changeFeature();
        };
    
    
    useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
      }));

            render(){

                
           if(this.state.data) {
            return(

        <div style={{backgroundColor: 'white', marginBottom: '200px'}}>
            <FormControl>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.state.feature}
          onChange={this.handleChange}
        >
          <MenuItem value={'valence'}>Positivity</MenuItem>
          <MenuItem value={'danceability'}>Danceability</MenuItem>
          <MenuItem value={'energy'}>Energy</MenuItem>
          <MenuItem value={'instrumentalness'}>Instrumentalness</MenuItem>
          <MenuItem value={'liveness'}>Liveness</MenuItem>
        </Select>
      </FormControl>
        <Card>
            {this.state.clicked && (this.state.data[0]['datasets'][0]['data'].length > 1) &&
                <Line ref={this.chartReference}
                                data={this.state.data[0]} options={{
            title:{
              display:true,
              text:`${this.state.labels[this.state.feature]} Score by Track`,
              fontSize:20,
              fontFamily: 'Montserrat'
            },
            legend:{
              display:false
            },
            scales: {
                yAxes: [{
                  gridLines: {
                    drawBorder: false,
                  },
                  display: false
                }]
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
            return (<Card><CardContent><p>Cannot construct graph for songs in {info.name}</p></CardContent></Card>);
            }

        }

export default AlbumGraph;

