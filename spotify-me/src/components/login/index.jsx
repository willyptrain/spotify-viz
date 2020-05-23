import React, { Component } from 'react';

import Redirect from '../common/Redirect';
import { getUrlParams } from '../../util/url';
import { getLoginRedirect, registerSpotify } from '../../util/auth';

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
        <div>
            <button className="btn btn-secondary" onClick={this.redirectToSpotify}>Login with Spotify</button>
          </div>
    );
  }
}
 
export default Login;