import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { getSpotifyUser } from './util/auth';
import Login from './components/login';
import Home from './components/home/Home';
import NavBar from './components/common/navbar/Navbar';
import Logout from './components/logout/Logout';
import './App.css';
import {logout} from './util/auth';
import { User } from 'react-spotify-api';
import GenreGraphs from './components/graphs/GenreGraphs';
import GenreMappings from './components/graphs/GenreMappings';
import ArtistPage from './components/artist/ArtistPage';
import Dash from './components/dashboard/Dash';
import TopArtists from './components/top_artists/TopArtists';


import TopTracks from './components/top_tracks/TopTracks';
import { Nav } from 'react-bootstrap';

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
          <div style={{height:'100%'}}>
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
              <Route exact path="/graphs">
                <NavBar/>
                <GenreGraphs />
              </Route>
              <Route exact path="/artist/:uri" render={(props) =>
                <div style={{height:'100%'}}>
                <NavBar/>
                <ArtistPage style={{height:'100%'}} id={props.match.params} />
                </div>
               } />
               <Route exact path="/top_artists">
                <NavBar/>
                <TopArtists/>
               </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}


export default App;