import React, { Component } from 'react';
//import Button from '@material-ui/core/Button';
import Redirect from '../common/Redirect';
import { getUrlParams } from '../../util/url';
import { getLoginRedirect, registerSpotify } from '../../util/auth';
import './login.css';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

import { Header } from 'semantic-ui-react';
import { Box, Grommet, Text } from 'grommet';
import { Analytics } from 'grommet-icons';
import { Pie } from 'react-chartjs-2';
import Particles from 'react-particles-js';

const customTheme = {
  global: {
    font: 'Montserrat',
    alignContent: 'center',
    align: 'center',
    alignSelf: 'center',
    justify: 'center',
    gap: 'large',
    colors: {
      // all colors could be either a string or a dark and light object
      text: {
        dark: '#DFE0E3',
        light: '#DFE0E3',
      },
      // or simply as a string:
      // text: "#456789",
    },
  },
};


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { redirectUrl: '' }
  }

  redirectToSpotify = async () => {
    const redirect = await getLoginRedirect();
    this.setState({ redirectUrl: redirect });
  }
  

  async componentDidMount() {
    const params = getUrlParams();
    const code = params.code || null;
    const { setUserInfo, history, userInfo } = this.props;
    console.log(code);
    if (userInfo && userInfo.id) {
      history.push('/');
      return;
    };
    if (!code) return;

    const user = await registerSpotify(code);
    setUserInfo(user);
  }

  render() {
    if (this.state.redirectUrl) {
      return <Redirect url={this.state.redirectUrl} />
    }

    return (
        <div id='full-screen'>
          <div style={{position: 'absolute', width:'100%', height:'100%'}}>
                <Particles 
              params={{ 
                particles: { 
                  number: { 
                    value: 200, 
                    density: { 
                      enable: true, 
                      value_area: 1500, 
                    } 
                  }, 
                }, 
              }} 
            /> 
            </div>
                      <Box elevation="large" className="login-card" fill="true" size="medium"
              pad="small" align='center' alignSelf='center' alignContent="center" width="40%" justify="center"
            >
              <Grommet theme={customTheme}>
            <Box animation="fadeIn" border={{size: "medium", color: "#DFE0E3"}} responsive="true" elevation="xlarge" background={{color: '#1A1919'}} basis="medium" round="none" pad="medium"  gap="medium" alignContent="center" justify="center" alignSelf="center" align="center">
            <Text size='300%'  color="#DFE0E3" weight="bold">Welcome to Spotipie</Text>
            <Analytics size="28%"  color="#DFE0E3" justify="center"></Analytics>
            <Text size="100%" color="#DFE0E3">Explore your Spotify listening history and <br></br> gain insights about your habits by logging in below.</Text>
            
            <div id='login-button'>
                <Button className="login-btn-item" style={{background: '#6fd862'}} primary label="Login with Spotify" onClick={this.redirectToSpotify}>Login with Spotify</Button>
            </div>
            </Box>
            </Grommet>
            </Box>
            
            <particles/>
        </div>
    );
  }
}
 
export default Login;