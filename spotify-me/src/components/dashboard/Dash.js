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

class Dash extends React.Component {

  constructor(props) {
    super(props);
  }
  

    render(){
      const user_info = this.props.userInfo;
        return(
        <div style={{ marginTop: `64px`, marginLeft: '84px', marginRight: '84px'}}>
            <Grommet style={{backgroundColor: "#EBEBEB"}} full>
    <Distribution margin="xsmall" gap="none"
      fill
      values={[
        { value: 50, color: "white", title: "Welcome, " + user_info.display_name + "!", data: <FetchUserWelcome data={user_info} /> },
        { value: 15, color: "white", title: "Your top tracks", data: <FetchDashTracks data="long_term" /> },
        { value: 15, color: "white", title: "Your top albums", data: <FetchDashAlbums data="long_term" /> },
        { value: 15, color: "white", title: "Your top artists", data: <FetchDashArtists data="long_term"/> },
        { value: 15, color: "white", title: null, data:null },
      ]}
    >
      {value => (
          <Card width="100%" height="100%" style={{backgroundColor: "white"}} className="userinfo-card">
                    <CardContent className="userinfo-info">
                    <Typography><b>{value.title}</b></Typography>
                    </CardContent>
                    {value.data}
            </Card>
      )}
    </Distribution>
  </Grommet></div>
        );
    }
}

export default Dash;