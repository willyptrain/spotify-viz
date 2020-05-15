from flask import Flask, redirect, url_for, session
from flask_dance.contrib.spotify import spotify, make_spotify_blueprint
import os
import tekore as tk
from flask_session import Session

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['SPOTIFY_CLIENT_ID']
# app.config['SPOTIFY_CLIENT_SECRET'] = os.environ['SPOTIFY_CLIENT_SECRET']

spotify_blueprint = make_spotify_blueprint(client_id=os.environ['SPOTIFY_CLIENT_ID'],
                                           client_secret=os.environ['SPOTIFY_CLIENT_SECRET'],
                                           redirect_url='http://127.0.0.1:5000/spotify_login/spotify/authorized')


app.register_blueprint(spotify_blueprint, url_prefix='/spotify_login')


os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route('/spotify')
def spotify_login():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))#url_for('spotify.login'))

    resp = spotify.get('v1/me')
    print(resp.json()['display_name'])
    session['nickname'] = resp.json()['display_name']
    return redirect(url_for('user',name=resp.json()['display_name']))


@app.route('/user/<name>')
def user(name):
    nickname = session.get('username', None)
    return name

if __name__ == '__main__':
    app.run(debug=True)






