from flask import redirect, url_for, session, render_template, request
from flask_dance.contrib.spotify import spotify, make_spotify_blueprint
import tekore as tk
from flask_session import Session
from oauthlib.oauth2.rfc6749.errors import TokenExpiredError
import spotipy
import json
import webbrowser
from web_app import app
from web_app.settings import spotify_id, spotify_secret
# from settings import spotify_secret, spotify_id

print(spotify_id)
spotify_blueprint = make_spotify_blueprint(client_id=spotify_id,
                                           client_secret=spotify_secret,
                                           redirect_url='http://127.0.0.1:5000/spotify',
                                           scope=['user-top-read'])

app.register_blueprint(spotify_blueprint, url_prefix='/spotify_login')

@app.route('/spotify', methods=['GET'], strict_slashes=False)
def spotify_login():
    if not spotify.authorized:
        return redirect(url_for('spotify.login'))
    try:
        resp = spotify.get('v1/me')
        json_response = resp.json()
        session['nickname'] = json_response['display_name'] if len(json_response['display_name']) > 0 else ""
        if(len(json_response['images']) > 0 and 'url' in  json_response['images'][0]):
            session['user_img'] = json_response['images'][0]['url']
        else:
            session['user_img'] = 'https://via.placeholder.com/150'
        print(json_response)
        return redirect(url_for('user', name=json_response['display_name'], time_range='short_term'))
    except (TokenExpiredError) as e: #was getting weird TokenExpiredError
        return redirect(url_for('spotify.login'))


@app.route('/user/<name>/<time_range>')
def user(name, time_range):
    print(name, time_range)
    nickname = name
    # nickname = session.get('nickname', None)
    image_url = session.get('user_img',None)
    #nickname = name
    #image_url = 'https://via.placeholder.com/150'
    token = spotify_blueprint.token["access_token"]
    top_tracks = []
    if(token):
        sp = spotipy.Spotify(auth=token)
        sp.trace = False
        k = 5
        range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
        results = sp.current_user_top_tracks(time_range=time_range, limit=k)
        print(results)
        if len(results['items']) == 0:
            for i in range(0, 5):
                top_tracks.append({
                    'track_name':'Empty',
                    'artist':'Empty',
                    'uri':'Empty',
                    'image':'Empty'
                })

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
