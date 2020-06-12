import React from "react";
import NavBar from '../common/navbar/Navbar';
import { Grommet, Distribution, Box, Text, grommet } from 'grommet';
import {FetchDashTracks} from './FetchDashTracks';

class Dash extends React.Component {
    render(){
        return(
            <Grommet theme={grommet} full>
    <Distribution
      fill
      values={[
        { value: 50, color: "neutral-3", title: null, data: null },
        { value: 21, color: "accent-3", title: "Top tracks", data: <FetchDashTracks data="long_term" /> },
        { value: 20, color: "#042f66", title: null, data:null },
        { value: 19, color: "#a2e0e5", title: null, data:null },
        { value: 5, color: "#1979a9", title: null, data:null }
      ]}
    >
      {value => (
        <Box pad="xsmall" background={value.color} fill>
          <Text size="large">{value.title}</Text>
          {value.data}
        </Box>
      )}
    </Distribution>
  </Grommet>
        );
    }
}

export default Dash;