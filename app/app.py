from flask import Flask, redirect, url_for, session, render_template, request
from flask_dance.contrib.spotify import spotify, make_spotify_blueprint
import os
import tekore as tk
from flask_session import Session
from oauthlib.oauth2.rfc6749.errors import TokenExpiredError
import spotipy
from flask_material import Material
import json
import webbrowser




app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['SPOTIFY_CLIENT_SECRET']
app.config['SPOTIFY_CLIENT_SECRET'] = os.environ['SPOTIFY_CLIENT_SECRET']

material = Material(app)


spotify_blueprint = make_spotify_blueprint(client_id=os.environ['SPOTIFY_CLIENT_ID'],
                                           client_secret=os.environ['SPOTIFY_CLIENT_SECRET'],
                                           redirect_url='http://127.0.0.1:5000/spotify',
                                           scope=['user-top-read'])

app.register_blueprint(spotify_blueprint, url_prefix='/spotify_login')


os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)



@app.route('/spotify')
def spotify_login():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))#url_for('spotify.login'))
    try:
        resp = spotify.get('v1/me')
        json_response = resp.json()
        session['nickname'] = json_response['display_name']
        if(len(json_response['images']) > 0 and 'url' in  json_response['images'][0]):
            session['user_img'] = json_response['images'][0]['url']
        # print(json_response)
        return redirect(url_for('user',name=resp.json()['display_name'], time_range='short_term'))

    except (TokenExpiredError) as e: #was getting weird TokenExpiredError
        return redirect(url_for('spotify.login'))


@app.route('/user/<name>/<time_range>')
def user(name, time_range):
    nickname = session.get('nickname', None)
    image_url = session.get('user_img',None)
    token = spotify_blueprint.token["access_token"]
    top_tracks = []
    if(token):
        sp = spotipy.Spotify(auth=token)
        sp.trace = False
        k = 5
        range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
        results = sp.current_user_top_tracks(time_range=time_range, limit=k)
        for i, result in enumerate(results['items']):
            top_tracks.append({
                'track_name':result['name'],
                'artist':result['artists'][0]['name'],
                'uri':result['uri'],
                'image':result['album']['images'][0]['url']
            })



    return render_template('home.html',
                           username=name,
                           user_img=image_url,
                           top_tracks=top_tracks,
                           k=k, time_range=range_nicknames[time_range])


@app.route('/logout')
def spotify_logout():
    for key in list(session.keys()):
        session.pop(key)

    webbrowser.open_new('https://www.spotify.com/logout/')
    return redirect('https://www.spotify.com/logout/')



@app.route('/unprotected')
def unprotected():
    return "You need some tokens!"



if __name__ == '__main__':
    app.run(debug=True)






