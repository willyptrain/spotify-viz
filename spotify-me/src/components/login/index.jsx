import React, { Component } from 'react';

import Redirect from '../common/Redirect';
import { getUrlParams } from '../../util/url';
import { getLoginRedirect, registerSpotify } from '../../util/auth';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import './login.css'
import Grid from '@material-ui/core/Grid';
// import {FontAwesomeIcon} from "@fontawesome/react-fontawesome";
// import {faSpotify} from "@fontawesome/free-solid-svg-icons";



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
    if (userInfo.id) {
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

    <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '80vh'}}
>
      <Grid item xs={12} sm={6}>
        <div className="container">
                <Card className="login-container">
                    <CardContent>
                        <div className="login-title">
                            <Typography style={{ top: '10px', position: 'relative'  }} className="spotify-title" component="h2" variant="h2">Spotify</Typography>
                            <Typography style={{ top: '30px', position: 'relative'  }} className="spotify-title" component="h2" variant="h2">Dashboard</Typography>
                        </div>
                        <i class="fa fa-spotify"></i>
                    </CardContent>

                </Card>
                  <Button className="login-button" size="small" fullWidth variant="extended"
                        aria-label="Delete" onClick={this.redirectToSpotify}>
                            Login with Spotify
                  </Button>
            </div>
      </Grid>
    </Grid>



    );
  }
}
 
export default Login;