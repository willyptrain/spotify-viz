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
from web_app.graphing import graph as viz
from web_app.graphing import music
from web_app.settings import spotify_secret, spotify_id
import chart_studio.tools as tls
from web_app.forms import AlbumForm, ArtistForm

spotify_blueprint = make_spotify_blueprint(client_id=spotify_id,
                                           client_secret=spotify_secret,
                                           redirect_url='http://127.0.0.1:5000/spotify',
                                           scope=['user-top-read'])

app.register_blueprint(spotify_blueprint, url_prefix='/spotify_login')


@app.route('/spotify', methods=['GET'], strict_slashes=False)
def spotify_login():
    if not spotify.authorized:
        print(url_for('spotify.login'))
        return redirect(url_for('spotify.login'))#url_for('spotify.login'))
    try:
        resp = spotify.get('v1/me')
        json_response = resp.json()
        session['nickname'] = json_response['display_name']
        if(len(json_response['images']) > 0 and 'url' in  json_response['images'][0]):
            session['user_img'] = json_response['images'][0]['url']
        else:
            session['user_img'] = 'https://via.placeholder.com/150'
        return redirect(url_for('user', name=session['nickname'], time_range='short_term'))
    except (TokenExpiredError) as e: #was getting weird TokenExpiredError
        return redirect(url_for('spotify.login'))


@app.route('/user/<name>/<time_range>')
def user(name, time_range):
    print(name, time_range)
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

@app.route('/recommendations')
def recommendations():
    nickname = session.get('nickname', None)
    image_url = session.get('user_img',None)
    token = spotify_blueprint.token["access_token"]
    if(token):
        sp = spotipy.Spotify(auth=token)
        sp.trace = False
        range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
        results = sp.current_user_top_tracks(time_range="long_term", limit=5)
        track_ids = list()
        for i, result in enumerate(results['items']):
            print(result['id'])
            track_ids.append('spotify:track:' + result['id'])
        recommendations = sp.recommendations(seed_tracks=track_ids, limit=5)
        k = len(recommendations)
        rec_list = list()
        for i, rec in enumerate(recommendations['tracks']):
            rec_list.append({
                'track_name':result['name'],
                'artist':result['artists'][0]['name'],
                'uri':result['uri'],
                'image':result['album']['images'][0]['url']
            })
    return render_template('recommendations.html', 
                            username=nickname,
                           user_img=image_url,
                           rec_list=rec_list,
                           k=k)
        

@app.route('/album_graph/', methods=['GET', 'POST'])
def album_graph():
    form = AlbumForm()
    if form.validate_on_submit():
        albums = form.album_list.data
        albums = albums.split(",")
        nickname = session.get('nickname', None)
        image_url = session.get('user_img',None)
        g = viz.Graph()
        g.construct_album_graph(albums=albums)
        link = g.draw_graph()
        embed_html = tls.get_embed(link)
        return render_template('album_graph_view.html', graph=embed_html, username=nickname, user_img=image_url)
    return render_template('album_graph.html', form=form)

@app.route('/artist_graph/', methods=['GET', 'POST'])
def artist_graph():
    form = ArtistForm()
    if form.validate_on_submit():
        artists = form.artist_list.data
        artists = artists.split(",")
        nickname = session.get('nickname', None)
        image_url = session.get('user_img',None)
        g = viz.Graph()
        g.construct_music_graph(artists=artists)
        link = g.draw_graph()
        embed_html = tls.get_embed(link)
        return render_template('artist_graph_view.html', graph=embed_html, username=nickname, user_img=image_url)
    return render_template('artist_graph.html', form=form)


@app.route('/logout')
def spotify_logout():
    for key in list(session.keys()):
        session.pop(key)

    webbrowser.open_new('https://www.spotify.com/logout/')
    return redirect('https://www.spotify.com/logout/')



@app.route('/unprotected')
def unprotected():
    return "You need some tokens!"
