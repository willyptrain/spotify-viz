import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import { Sidebar } from 'semantic-ui-react';
import FavTracks from './FavTracks';
import {Distribution, Box, Text} from 'grommet';


class UserFavorites extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return(
            <Distribution style={{maxHeight:'100vh'}} className="dist-box-albums"
            values={[
              { value: 100, className:"fav-tracks", show: true, data: <FavTracks {...this.state}/> },
            ]} >
            {value => (
          <Box className={value.className} pad="small" fill>
            {value.show && value.data}
          </Box>
        )}
      </Distribution>
        );
    }
}

export default UserFavorites;
