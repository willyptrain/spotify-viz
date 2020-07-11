import React from "react";
import NavBar from '../common/navbar/Navbar';
import { Grommet, Distribution, Box, Text, grommet } from 'grommet';
import {FetchDashTracks} from './FetchDashTracks';
import FetchUserWelcome from './FetchUserWelcome';
import {FetchDashAlbums} from './FetchDashAlbums';
import {FetchDashArtists} from './FetchDashArtists';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import './userinfo.css';
import cookie from 'js-cookie';
import axios from 'axios';
import GenreChart from './GenreChart.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

class Dash extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

  }



    async componentDidMount() {
            let token = cookie.get('access_token');
        axios.get(`/api/user_info/${token}/`)
        .then(res => {
            console.log(res.data);
            this.setState(res.data[0]);

        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })
    }
  

    render(){
      const user_info = this.props.userInfo;
        return(
        <div style={{ overflow: 'hidden', marginTop: `2vh`, marginLeft: '84px', width: '92%'}}>
           <BrowserView>
            {this.state['username'] &&
            <Grommet style={{overflow: 'hidden', width: '100%',backgroundColor: "#EBEBEB"}} full>
            <Distribution style={{overflow: 'hidden'}} margin="xsmall" gap="none"
              fill
              values={[

                { value: 30, color: "white", overflow: false, title: "Short term genres", data: <GenreChart mobile={false} data={this.state} chart="doughnut" range="short" /> },
                { value: 30, color: "white", overflow: false, title: "Long term genres", data: <GenreChart mobile={false} data={this.state} chart="radar" range="long" /> },
                { value: 30, color: "white", overflow: false, title: "", data: <FetchUserWelcome data={this.state} /> },
                { value: 25, color: "white", overflow: true, data: <FetchDashTracks data="long_term" /> },
                { value: 25, color: "white", overflow: true, data: <FetchDashArtists data="long_term"/> }
              ]}
            >
              {value => (

                    <Card width="100%" height="100%" style={{backgroundColor: "white", overflow: value.overflow ? 'scroll': 'hidden'}} className="userinfo-card">
                        {value.data}
                    </Card>

              )}
            </Distribution>
          </Grommet>}
          {!this.state['username'] &&
          <div class="loading">
            <CircularProgress/>
          </div>
          }

           </BrowserView>
           <MobileView>
            {this.state['username'] &&
               <div style={{width: '80%'}}>
                    <Card style={{backgroundColor: "white"}} className="userinfo-card">
                               <FetchUserWelcome data={this.state} />
                    </Card>
                    <Card height='25vh' style={{backgroundColor: "white", height: '25vh'}} className="userinfo-card">
                                <GenreChart height='25vh' mobile={true}  style={{height: '25vh'}} data={this.state} chart="doughnut" range="short" />
                    </Card>
                     <Card style={{backgroundColor: "white"}} className="userinfo-card">
                                <GenreChart data={this.state} mobile={true}  chart="radar" range="long" />
                    </Card>


               </div>
             }

           </MobileView>

            </div>
        );
    }
}

export default Dash;
