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
import math
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

@app.route('/user/<time_range>/<token>/<k>/')
def user_tracks(time_range, token, k=10):
    k = int(k)
    top_tracks = []
    image_url = 'https://via.placeholder.com/150'
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
    print(sp.current_user())
    range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
    results = sp.current_user_top_tracks(time_range=time_range, limit=k)
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
                'id':result['artists'][0]['id'],
                'image':result['album']['images'][0]['url']
            })
    return jsonify(top_tracks=top_tracks)


@app.route('/user_albums/<time_range>/<token>')
def user_albums(time_range, token):
    top_tracks = []
    image_url = 'https://via.placeholder.com/150'
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
    k = 50
    range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
    results = sp.current_user_top_tracks(time_range=time_range, limit=k)
    if len(results['items']) < k:
        for i in range(0, k):
            top_tracks.append({
                'track_name':'Empty',
                'album' : 'Empty',
                'artist':'Empty',
                'uri':'Empty',
                'image':'Empty'
            })
    else:
        for i, result in enumerate(results['items']):
            top_tracks.append({
                'track_name':result['name'],
                'artist':result['artists'][0]['name'],
                'album' : result['album'],
                'uri':result['uri'],
                'id':result['artists'][0]['id'],
                'image':result['album']['images'][0]['url']
            })
    album_points = {}
    albums = []
    for i in range(0, len(top_tracks)):
        track = top_tracks[i]
        cur_points = math.ceil((50 - i)/5)
        if track['album']['name'] not in album_points.keys():
            album_points[track['album']['name']] = cur_points
            albums.append(track['album'])
        else:
            album_points[track['album']['name']] += cur_points
    sort_albums = sorted(album_points.items(), key=lambda x: x[1], reverse=True)
    final_albums = []
    for i in range(0, len(sort_albums)):
        for album in albums:
            if album['name'] == sort_albums[i][0]:
                final_albums.append(album)
    print(final_albums)
    return jsonify(albums=final_albums)



@app.route('/artist/<id>/<token>')
def artist_info(id, token):
    if(not id):
        raise Exception("ID Error")
    sp = spotipy.Spotify(auth=token)
    get_artist = sp.artist(id)
    n2v = Node2VecModel('model_kv.kv')
    labels,scores,colors = n2v.get_mappings_for_genres(get_artist['genres'])


    if(len(scores) == 1):
        return jsonify({
            'artist_info': get_artist,
            'albums': sp.artist_albums(id),
            'genre_data': {
                'labels': [labels[0]],
                'scores': [1],
                'colors': [colors[0]]
            }
        })

    return jsonify({
        'artist_info':get_artist,
        'albums':sp.artist_albums(id),
        'genre_data': {
            'labels': labels,
            'scores': scores,
            'colors': colors
        }
    })

@app.route('/user_info/<token>/')
def user_info(token):
    sp = spotipy.Spotify(auth=token)
    user_info = sp.current_user()
    image_url = user_info['images'][0]['url']
    subscription = user_info['product']
    user_id = user_info['id']
    user_url = user_info['external_urls']['spotify']
    username = user_info['display_name']
    return jsonify([{
        'username' :username,
        'user_url' : user_url,
        'user_id' : user_id,
        'subscription' : subscription,
        'image_url' : image_url,
    }])


@app.route('/track/<track>/<token>')
def track_info(track, token):
    sp = spotipy.Spotify(auth=token)
    popularity = sp.track(track)['popularity']
    features = sp.audio_features(track)
    feature_list = ['danceability', 'energy', 'instrumentalness', 'liveness','loudness']
    labels = ['Danceability', 'Energy', 'Instrumentalness', 'Liveness','Loudness']
    scores = []
    colors = ['#f1a5ba', '#f5b565', '#fbd981', '#93dcdc', '#6cb8ee']
    for k,v in features[0].items():
        if(k in feature_list):
            if(k == 'loudness'):
                if(math.log10(60+v) < 1):
                    value = 0
                else:
                    val = 60 + v
                    value = (math.log10(val))/math.log10(60)
                scores.append(value)
            else:
                scores.append(v)



    return jsonify({
        'popularity': popularity,
        'scores': scores,
        'labels': labels,
        'colors': colors
    })


@app.route('/related_tracks/<track>/<token>')
def related_tracks(track, token):
    sp = spotipy.Spotify(auth=token)
    recommendations = sp.recommendations(seed_artists=[track])
    artists = []
    images = []
    song_names = []
    for result in recommendations["tracks"]:
        artist = result['artists'][0]['name']
        name = result['name']
        artists.append(artist)
        song_names.append(name)
        images.append(result["album"]["images"][0]["url"])

    return jsonify({
        'artists':artists,
        'song_names':song_names,
        'images':images
    })



@app.route('/user_artists/<time_range>/<token>')
def user_artists(time_range, token):
    top_artists = []
    image_url = 'https://via.placeholder.com/150'
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
    k = 10
    range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
    results = sp.current_user_top_artists(time_range=time_range, limit=k)
    print(results['items'][0].keys())

    if len(results['items']) < k:
        for i in range(0, k):
            top_artists.append({
                'artist_name':'Empty',
                'followers':'Empty',
                'popularity':'Empty',
                'uri':'Empty',
                'id': 'Empty',
                'image':'Empty'
            })
    else:
        for i, result in enumerate(results['items']):
            top_artists.append({
                'artist_name':result['name'],
                'popularity':result['popularity'],
                'genres': result['genres'],
                'uri':result['uri'],
                'id':result['id'],
                'image':result['images'][0]['url']
            })
    print(top_artists)
    return jsonify(top_artists=top_artists)




@app.route('/graphs/<time_range>/<token>')
def user_graph(time_range, token):
    n2v = Node2VecModel('model_kv.kv', token=token)
    labels = []
    scores = []
    colors = []
    labels, scores,colors = n2v.get_mappings_by_range(token, time_range)
    print(labels, scores, colors)
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
