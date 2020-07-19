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
import TopAlbums from './components/top_albums/TopAlbums';
import SearchTracks from './components/search/SearchTracks';
import TopTracks from './components/top_tracks/TopTracks';
import { Nav } from 'react-bootstrap';
import Sidebar from './components/sidebar/Sidebar';
import Redirect from './components/common/Redirect.jsx'
import TrackPage from './components/track/TrackPage.js'
import RecommendedPage from './components/recommendations/RecommendedPage.js';

class App extends Component{

  constructor(props) {
    super(props);
    console.log(props);
    this.state =  {status: 'Not logged in'};
  }

  search = (term) => {
    console.log(this.state)
    let currStatus = ('status' in this.state ? this.state['status'] : null);
    let currInfo = 'userInfo' in this.state ? this.state['userInfo'] : null;
    this.setState({
        status: currStatus,
        userInfo: currInfo,
        searchTerm: term
    },console.log("EMEMEMEMEM"+currStatus+", "+currInfo));

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
    console.log(userInfo);
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
                (userInfo == 'Not logged in') || !(userInfo) || ('status' in userInfo && userInfo['status'] == 'Not logged in') ?
                 <Login {...props} setUserInfo={this.setUserInfo} userInfo={userInfo} />
                 : <div>
                <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                 <Dash userInfo={userInfo}/>
                 </div>
              }/>
              <Route exact path="/logout" component={(props) =>
                 <Logout userInfo={userInfo} />
               }/>

              <Route exact path="/top_tracks">
                <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                <TopTracks/>
              </Route>
              <Route exact path="/graphs">
                <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                <GenreGraphs />
              </Route>
              <Route exact path="/artist/:uri" render={(props) =>
                <div style={{height:'100%'}}>
                <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                <ArtistPage style={{height:'100%'}} id={props.match.params} />
                </div>
               } />
               <Route exact path="/search/:term" render={(props) =>
                <div style={{height:'100%'}}>
                <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                <SearchTracks style={{height:'100%'}} id={props.match.params} />
                </div>
               } />
               <Route exact path="/track/:uri" render={(props) =>
                <div style={{height:'100%'}}>
                <Sidebar playback={true} id={props.match.params} searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                <TrackPage style={{height:'100%'}} id={props.match.params} />
                </div>
               } />
               <Route exact path="/top_artists">
               <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                <TopArtists/>
               </Route>
               <Route exact path="/top_albums">
                 <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                 <TopAlbums/>
               </Route>
               <Route exact path="/dashboard">
                 <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                 <Dash userInfo={userInfo}/>
               </Route>
               <Route exact path="/recommended">
                 <Sidebar searchFunc={this.search} searchTerm={this.state['searchTerm']} userInfo={userInfo}/>
                 <RecommendedPage/>
               </Route>

            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}


export default App;