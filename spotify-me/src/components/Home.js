import React from "react";
import { logout } from '../util/auth';
import NavBar from './Navbar.js';
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
        return(
            <div>
            <NavBar logout={this.logout} />
            <h1>Hello!</h1>
            </div>
        );
    }
}

export default Home;