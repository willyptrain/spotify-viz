import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { getSpotifyUser } from './util/auth';
import Login from './components/login';
import Home from './components/Home';
import NavBar from './components/Navbar';
import Logout from './components/Logout';
import './App.css';
import {logout} from './util/auth';
import { User } from 'react-spotify-api';

import TopTracks from './components/TopTracks';

class App extends Component{
  state = {
    userInfo: {},
  }

  setUserInfo = (userInfo) => this.setState({ userInfo });

  async componentDidMount() {
    const userInfo = await getSpotifyUser();
    
    if (userInfo) {
      this.setUserInfo(userInfo);
    }
  }
  render(){
    const { userInfo } = this.state;
    return (
      <div className="App">
        <Router>
          <div>
            <Switch>
              <Route exact path="/login" component={(props) => 
                <Login {...props} setUserInfo={this.setUserInfo} userInfo={userInfo} />
              }/>
              <Route exact path="/" component={(props) =>
                <div>
                  <Home userInfo={userInfo} />
                </div>
              }/>
              <Route exact path="/logout">
                <Logout/>
              </Route>
              <Route exact path="/top_tracks">
                <NavBar/>
                <TopTracks/>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}


export default App;