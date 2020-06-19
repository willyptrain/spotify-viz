import React from "react";
import { logout } from '../../util/auth';
import NavBar from '../common/navbar/Navbar';
import { Album } from 'react-spotify-api';
import { SpotifyApiContext} from 'react-spotify-api';
<<<<<<< HEAD
import Sidebar from '../sidebar/Sidebar';
=======
import Login  from './../login/index.jsx';

>>>>>>> origin/new_will
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
       if(this.props.userInfo == 'Not logged in' || (this.props.userInfo == null) || (this.props == null)) {
           return (
            <div>
                <Login userInfo={this.props.userInfo}></Login>
            </div>
           );
       } else {
       console.log(this.props.userInfo);
        return(
            <div>
<<<<<<< HEAD
            <Sidebar userInfo={this.props.userInfo}/>
            <h1>Hello!
=======
            <NavBar userInfo={this.props.userInfo} logout={this.logout}/>
            <h1>Goodbye!
>>>>>>> origin/new_will
            </h1>
            </div>
        );
        }
    }
}

export default Home;