import React from "react";
import { logout } from '../util/auth';
import NavBar from './Navbar.js';
import { Album } from 'react-spotify-api';
import { SpotifyApiContext} from 'react-spotify-api';
class Home extends React.Component{


    constructor(props) {
        super(props);
        console.log(this.props);
      }
    async componentDidMount() {
        const { userInfo, history } = this.props; 
    }
    logout = async () => {
        const res = await logout();
        if (res.status === 200) {
        }
        }
        
    render(){
        console.log(this.props.userInfo);
        return(
            <div>
            <NavBar userInfo={this.props.userInfo} logout={this.logout}/>
            <h1>Hello!
            <SpotifyApiContext.Provider value={'AQC2UbyKn-I4gAVOXhz7oy2f-zNzCCBLNjS0PU9c3O_2McnetzOP__aIdN_ZR5P7nAp-gpJLSkpeWuQBYmJdeZgRAPey7fmgBZH3Mpne561Fwe77JrGNG0UllMYq9oHFPPnKAyp4nlGTcv6-CY1PZl2v2U6ccO9-ar7_s7wxojRYQ2M9svOQOzo4ti3UpVflKvKPk_i9CISc_bBu'}>
            <Album id={`0i3evFc1mhTVNHaF0DFwog`}>
            {({ data }) => {
                return <>{data}</>;
            }}
            </Album>
            </SpotifyApiContext.Provider>
            </h1>
            </div>
        );
    }
}

export default Home;