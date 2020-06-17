import React from "react";
import NavBar from '../common/navbar/Navbar';
import { Grommet, Distribution, Box, Text, grommet } from 'grommet';
import {FetchDashTracks} from './FetchDashTracks';
import {FetchUserWelcome} from './FetchUserWelcome';

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
        { value: 50, color: "white", title: "hello", data: <FetchUserWelcome data={user_info} /> },
        { value: 21, color: "white", title: "Top tracks", data: <FetchDashTracks data="long_term" /> },
        { value: 20, color: "white", title: null, data:null },
        { value: 19, color: "white", title: null, data:null },
        { value: 5, color: "white", title: null, data:null }
      ]}
    >
      {value => (
        <Box pad="xsmall" background={value.color} fill>
          <Text size="large">{value.title}</Text>
          {value.data}
        </Box>
      )}
    </Distribution>
  </Grommet></div>
        );
    }
}

export default Dash;