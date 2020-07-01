import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Redirect from '../common/Redirect';
import { getUrlParams } from '../../util/url';
import { getLoginRedirect, registerSpotify } from '../../util/auth';
import './login.css';


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
        <div class="landing-page-body">

            <h1 className="welcome-title">Welcome</h1>
            <h1 className="welcome-subtitle">Spotify Dashboard</h1>


            <Button className="login-btn" variant="contained" onClick={this.redirectToSpotify}>Login with Spotify</Button>
        </div>
    );
  }
}
 
export default Login;