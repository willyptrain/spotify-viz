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
import PropTypes from 'prop-types';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import Fab from '@material-ui/core/Fab';


export function FetchTracks(data) {
    console.log(data.data)
    const [tracks, setTracks] = useState([]);
    const isCardFunction = (data.handleChange != null);
        const spacer = data.clicked ? 3 : 2;
    const k = 50;



    let token = cookie.get('access_token');
    useEffect(() => {
        axios.get(`/api/user/${data.data}/${token}/${k}`)
            .then(res => {
                setTracks(res.data.top_tracks);
                console.log(res.data.top_tracks);
            })
            .catch(err => {
                console.log('error :(')
                console.log(err)
            })
    }, [data.data])


    return(

<div>
    <Grid container className="grid-container"
  alignItems="center"
  justify="center" spacing={0}>

{
                        tracks.map((track,index) =>
                            <Grid item xs={6} sm={spacer}>
                            {isCardFunction &&
                                <Card onClick={() => data.handleChange(track)} className="track-card">

                                <CardMedia className="track-img" image={track.image}></CardMedia>
                                <CardContent className="track-info">
                                <Typography className="music-title" gutterBottom variant="h6" component="h6">{index+1}. {track.track_name}</Typography>
                                </CardContent>



                            </Card>
                            }

                         </Grid>
                        )}

     </Grid>
      </div>
    );
}


/*

class FetchTracks extends React.Component {


    constructor(props) {
        super(props);
        console.log(props);
//        const [tracks, setTracks] = useState([]);
//        const [track, setTrack] = useState([]);
//        const [artistId, setArtistId] = useState([]);
        this.k = 50;
        this.data = this.props.data;
         this.state = {value: this.props.data, clicked: this.props.clicked, hovering: new Array(this.k).fill(false)};
        this.isCardFunction = (this.props.handleChange != null);
        this.spacer = this.props.clicked ? 4 : 2;
        this.scroll = this.props.clicked ? 'scroll' : 'hidden';
        this.hovering = false;
    }


    async componentDidMount() {

        let token = cookie.get('access_token');
            axios.get(`/api/user/${this.props.data}/${token}/${this.k}`)
            .then(res => {
                this.setState(oldState => ({
                    'value':  this.state['value'],
                    'tracks': res.data.top_tracks,
                    'hovering':oldState.hovering
                }));
            })
            .catch(err => {
                console.log('error :(')
                console.log(err)
            })
    }
    async componentDidUpdate(prev) {

        if(prev.value != this.props['value']) {

            let token = cookie.get('access_token');
                axios.get(`/api/user/${this.props.data}/${token}/${this.k}`)
                .then(res => {
                    this.setState(oldState => ({
                        'value':  oldState.value,
                        'tracks': res.data.top_tracks,
                        'hovering':oldState.hovering
                    }));
                })
                .catch(err => {
                    console.log('error :(')
                    console.log(err)
                })

        }

     }


        handleHover = (index, bool) => {
            var temp = this.state['hovering'];
            temp[index] = bool;
            this.setState(oldState => ({
                'value':  oldState.value,
                'tracks': oldState.tracks,
                'hovering':temp
            }));

        }
        render() {

            if('tracks' in this.state) {
                return(

                <div style={{height: 'auto', overflow: this.scroll}}>
                    <Grid container className="grid-container"
                  alignItems="center"
                  justify="center" spacing={0}>

                         {
                        this.state['tracks'].map((track,index) =>
                            <Grid item xs={6} sm={this.spacer} md={this.spacer} lg={this.spacer}>
                            {this.isCardFunction &&
                                <Card onMouseEnter={() => this.handleHover(index, true)} onMouseLeave={() => this.handleHover(index, false)}
                                        onClick={() => this.props.handleChange(track)} className="track-card">

                                <CardMedia className="track-img" image={track.image}></CardMedia>
                                <CardContent className="toptracks-info">
                                <Typography className="music-title" gutterBottom variant="h6" component="h6">{index+1}. {track.track_name}</Typography>
                                </CardContent>



                            </Card>
                            }

                         </Grid>
                        )}

                      </Grid>
                      </div>
                    );
            }
            else {
                return (<div>Loading...</div>);
            }



            }

}
*/
//export default FetchTracks;
//
//           <CardContent className="track-info">
//                                        <Typography className="music-title" gutterBottom variant="h6" component="h6">{index+1}. {track.track_name} by {track.artist}</Typography>
//                                    </CardContent>

