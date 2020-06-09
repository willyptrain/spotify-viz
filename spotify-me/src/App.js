import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { getSpotifyUser } from './util/auth';
import Login from './components/login';
import Home from './components/home/Home';
import NavBar from './components/common/navbar/Navbar';
import Logout from './components/logout/Logout';
import GenreGraphs from './components/graphs/GenreGraphs'
import './App.css';
import {logout} from './util/auth';
import { User } from 'react-spotify-api';

import TopTracks from './components/top_tracks/TopTracks';

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
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        <Router>
          <div>
            <Switch>
              <Route exact path="/login" component={(props) => 
                <Login setUserInfo={this.setUserInfo} userInfo={userInfo} />
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
               <Route exact path="/graphs" component={(props) =>
                <>
                <NavBar/>
                <GenreGraphs {...props} userInfo={userInfo}  />
                </>
              }/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}


export default App;