import React from "react";
import NavBar from '../common/navbar/Navbar';
import { Grommet, Distribution, Box, Text, grommet } from 'grommet';
import {FetchDashTracks} from './FetchDashTracks';
import FetchUserWelcome from './FetchUserWelcome';
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
        <div style={{ marginTop: `64px`, marginLeft: '84px'}}>
            <Grommet theme={grommet} full>
    <Distribution
      fill
      values={[
        { value: 50, color: "white", title: "Welcome, " + user_info.display_name + "!", data: <FetchUserWelcome data={user_info} /> },
        { value: 21, color: "white", title: "Top tracks", data: <FetchDashTracks data="long_term" /> },
        { value: 20, color: "white", title: null, data:null },
        { value: 19, color: "white", title: null, data:null },
        { value: 5, color: "white", title: null, data:null }
      ]}
    >
      {value => (
        <Box pad="xsmall" background={value.color} fill>
          <Card className="userinfo-card">
                    <CardContent className="userinfo-info">
                    <Typography>{value.title}</Typography>
                    </CardContent>
                    {value.data}
            </Card>
        </Box>
      )}
    </Distribution>
  </Grommet></div>
        );
    }
}

export default Dash;