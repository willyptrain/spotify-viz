from flask import redirect, url_for, session, render_template, request, jsonify
from flask_dance.contrib.spotify import spotify, make_spotify_blueprint
import tekore as tk
from flask_session import Session
from oauthlib.oauth2.rfc6749.errors import TokenExpiredError
import spotipy
import json
import webbrowser
from web_app import app, lists, user, node2vec_model
from web_app.settings import spotify_id, spotify_secret

# from settings import spotify_secret, spotify_id
# import node2vec_model
from web_app.node2vec_model import Node2VecModel
from web_app.lists import items
from web_app.user import User
from spotipy.exceptions import SpotifyException
import spotipy.util as util


spotify_blueprint = make_spotify_blueprint(client_id=spotify_id,
                                           client_secret=spotify_secret,
                                           redirect_url='http://127.0.0.1:3000/callback',
                                           scope=['user-top-read'])

app.register_blueprint(spotify_blueprint, url_prefix='/spotify_login')

@app.route('/', methods=['GET'], strict_slashes=False)
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
        return redirect(url_for('user', name=json_response['display_name'], time_range='short_term'))
    except (TokenExpiredError) as e: #was getting weird TokenExpiredError
        return redirect(url_for('spotify.login'))

'''
@app.route('')
def user(name, time_range):
    token = spotify_blueprint.token["access_token"]
    top_tracks = []
    if(token):
        #nickname = name
        #nickname = session.get('nickname', None)
        #image_url = session.get('user_img',None)
        image_url = 'https://via.placeholder.com/150'
        #print(type(image_url))
        print(token)
        sp = spotipy.Spotify(auth=token)
        sp.trace = False
        k = 5
        range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
        results = sp.current_user_top_tracks(time_range=time_range, limit=k)
        if len(results['items']) < 5:
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


    return jsonify(username=name,
                    user_img=image_url,
                    top_tracks=top_tracks,
                    k=k, time_range=range_nicknames[time_range])
'''

@app.route('/user/<time_range>/<token>')
def user_tracks(time_range, token):

    top_tracks = []
    image_url = 'https://via.placeholder.com/150'
    k = 10
    try:
        sp = spotipy.Spotify(auth=token)
        sp.trace = False
        results = sp.current_user_top_tracks(time_range=time_range, limit=k)
    except:
        raise Exception("Error")
    range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
    if len(results['items']) < k:
        for i in range(0, k):
            top_tracks.append({
                'track_name':'Empty',
                'artist':'Empty',
                'uri':'Empty',
                'image':'Empty'
            })
    else:
        for i, result in enumerate(results['items']):
            top_tracks.append({
                'track_name':result['name'],
                'artist':result['artists'][0]['name'],
                'uri':result['uri'],
                'image':result['album']['images'][0]['url']
            })

    print(top_tracks)
    return jsonify(top_tracks=top_tracks)


@app.route('/graphs/<time_range>/<username>/<token>')
def user_graph(time_range, username,token):
    n2v = Node2VecModel('model_kv.kv')
    print(token)
    labels = []
    scores = []
    labels, scores,colors = n2v.get_mappings_by_range(username, time_range)
    # print(labels,scores)
    return jsonify({
        'labels':labels,
        'scores':scores,
        'colors':colors
    })


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

@app.route('/logout')
def spotify_logout():
    for key in list(session.keys()):
        session.pop(key)

    webbrowser.open_new('https://www.spotify.com/logout/')
    return redirect('https://www.spotify.com/logout/')



@app.route('/unprotected')
def unprotected():
    return "You need some tokens!"
