from flask import redirect, url_for, session, render_template, request, jsonify
from flask_dance.contrib.spotify import spotify, make_spotify_blueprint
import tekore as tk
from flask_session import Session
from oauthlib.oauth2.rfc6749.errors import TokenExpiredError
import spotipy
import json
import webbrowser
from . import app, lists, user, node2vec_model
from .settings import spotify_id, spotify_secret
import math
# from settings import spotify_secret, spotify_id
# import node2vec_model
from .node2vec_model import Node2VecModel
from .lists import items
from .user import User
from spotipy.exceptions import SpotifyException
import spotipy.util as util


spotify_blueprint = make_spotify_blueprint(client_id=spotify_id,
                                           client_secret=spotify_secret,
                                           redirect_url='http://127.0.0.1:3000/callback',
                                           scope=['user-library-modify', 'user-library-read', 'user-read-private', 'playlist-modify-private', 'user-follow-modify'])

app.register_blueprint(spotify_blueprint, url_prefix='/spotify_login')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/user/<time_range>/<token>/<k>/')
def user_tracks(time_range, token, k=10):
    k = 50
    top_tracks = []
    image_url = 'https://via.placeholder.com/150'
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
    print(sp.current_user())
    range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
    results = sp.current_user_top_tracks(time_range=time_range, limit=50)
    print(results['items'][0])
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


@app.route('/user_albums/<time_range>/<token>/<k>/')
def user_albums(time_range, token, k=10):
    k = 50
    top_tracks = []
    image_url = 'https://via.placeholder.com/150'
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
    range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
    results = sp.current_user_top_tracks(time_range=time_range, limit=50)
    if len(results['items']) < 50:
        for i in range(0, 50):
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
    return jsonify(albums=final_albums[0:k])




@app.route('/artist/<id>/<token>')
def artist_page(id, token):
    sp = spotipy.Spotify(auth=token)

    return jsonify({
        'info':sp.artist(id),
        'albums':sp.artist_albums(id)
    })


@app.route('/artist_graph/<id>/<token>')
def artist_info(id, token):
    if(not id):
        raise Exception("ID Error")
    sp = spotipy.Spotify(auth=token)
    get_artist = sp.artist(id)
    n2v = Node2VecModel('model_kv.kv', token=token)
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

    top_recent_tracks = sp.current_user_top_tracks(time_range='short_term', limit=50)
    top_all_tracks = sp.current_user_top_tracks(time_range='long_term', limit=50)
    short_term_genres = {}
    for i in range(0, len(top_recent_tracks['items'])):
        result = top_recent_tracks['items'][i]
        artist_id = result['artists'][0]['id']
        artist_genres = sp.artist(artist_id)['genres']
        cur_points = math.ceil((50 - i)/5)
        for genre in artist_genres:
            if genre not in short_term_genres.keys():
                short_term_genres[genre] = cur_points
            else:
                short_term_genres[genre] += cur_points
    sort_genres = sorted(short_term_genres.items(), key=lambda x: x[1], reverse=True)
    final_short_term_genres = []
    for i in range(0, 5):
        final_short_term_genres.append(sort_genres[i][0])

    long_term_genres = {}
    for i in range(0, len(top_all_tracks['items'])):
        result = top_all_tracks['items'][i]
        artist_id = result['artists'][0]['id']
        artist_genres = sp.artist(artist_id)['genres']
        cur_points = math.ceil((50 - i)/5)
        for genre in artist_genres:
            if genre not in long_term_genres.keys():
                long_term_genres[genre] = cur_points
            else:
                long_term_genres[genre] += cur_points
    sort_long_genres = sorted(long_term_genres.items(), key=lambda x: x[1], reverse=True)
    final_long_term_genres = []
    for i in range(0, 5):
        final_long_term_genres.append(sort_long_genres[i][0])
        
    return jsonify([{
        'username' :username,
        'user_url' : user_url,
        'user_id' : user_id,
        'subscription' : subscription,
        'image_url' : image_url,
        'short_term_genres' : final_short_term_genres,
        'long_term_genres' : final_long_term_genres,
    }])
@app.route('/album_track_info/<album>/<token>')
def album_track_info(album, token):
    sp = spotipy.Spotify(auth=token)
    album_info = sp.album(album)
    track_names  = []
    track_ratings = []
    previews = []
    for track in album_info["tracks"]["items"]:
        track_info = sp.track(track['id'])
        track_names.append(track_info['name'])
        track_ratings.append(track_info['popularity'])
        previews.append(track_info["preview_url"])


    return {
        'album_name':album_info['name'],
        'tracks_in_album':album_info["tracks"]["items"],
        'popularities':track_ratings,
        'track_names':track_names,
        'audio': previews,
        'username': sp.me()['display_name']
    }


@app.route('/track/save/<tracks>/<username>/<token>')
def save_track(tracks, username,token):

    new_token = spotipy.util.prompt_for_user_token(username,scope="user-library-modify",client_id=spotify_id,
                                           client_secret=spotify_secret,
                                           redirect_uri='http://localhost:3000/login')

    sp = spotipy.Spotify(auth=new_token)
    print()
    print()
    print(sp.me())
    print()
    print(sp.current_user_saved_tracks_add([tracks]))
    data = request.json
    print("data is " + format(data))

    return "added?"











@app.route('/album/<album>/<token>')
def album_info(album, token):
    sp = spotipy.Spotify(auth=token)
    feature_list = ['danceability', 'energy', 'instrumentalness', 'liveness', 'valence']
    labels = ['Danceability', 'Energy', 'Instrumentalness', 'Liveness', 'Positivity']
    scores = {'danceability': [], 'energy':[], 'instrumentalness':[], 'liveness':[], 'valence':[]}
    names = []
    dataset = {'danceability': [], 'energy':[], 'instrumentalness':[], 'liveness':[], 'valence':[]}


    album_info = sp.album(album)
    previews = []

    for result in album_info["tracks"]["items"]:
        id = result['id']
        name = result['name']
        names.append(name)
        previews.append(sp.track(id)['preview_url'])
        features = sp.audio_features(id)
        for feat in feature_list:
            scores[feat].append(features[0][feat])
            dataset[feat].append({
                'name':name,
                'score':features[0][feat]
            })



    return {
        'album_info':album_info,
        'scores':scores,
        'labels':labels,
        'names': names,
        'dataset':dataset,
        'audio':previews

    }


@app.route('/track/<track>/<token>')
def track_info(track, token):
    sp = spotipy.Spotify(auth=token)
    popularity = sp.track(track)['popularity']
    features = sp.audio_features(track)
    feature_list = ['danceability', 'energy', 'instrumentalness','loudness', 'valence']
    labels = ['Danceability', 'Energy', 'Instrumentalness','Loudness', 'Positivity']
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


@app.route('/related_albums/<track>/<token>')
def related_albums(albums, token):
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
        'images':images,
        'username':sp.me()['display_name']
    })

@app.route('/related_tracks/<track>/<token>')
def related_tracks(track, token):
    sp = spotipy.Spotify(auth=token)
    recommendations = sp.recommendations(seed_artists=[track])
    artists = []
    images = []
    song_names = []
    previews = []
    for result in recommendations["tracks"]:
        track = sp.track(result["id"])
        previews.append(track["preview_url"])
        artist = result['artists'][0]['name']
        name = result['name']
        artists.append(artist)
        song_names.append(name)
        images.append(result["album"]["images"][0]["url"])

    return jsonify({
        'artists':artists,
        'song_names':song_names,
        'images':images,
        'audio':previews,
        'username': sp.me()['display_name']
    })

@app.route('/user_artists/<time_range>/<token>/<k>/')
def user_artists(time_range, token, k=10):
    k = 50
    top_artists = []
    image_url = 'https://via.placeholder.com/150'
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
    range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
    results = sp.current_user_top_artists(time_range=time_range, limit=50)
    if len(results['items']) <= 1:
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
    return jsonify(top_artists=top_artists)


@app.route('/user/currently_playing/<token>/')
def get_currently_playing(token):
    sp = spotipy.Spotify(auth=token)
    cur_track = sp.current_user_playing_track()
    name = cur_track['item']['name']
    artist = cur_track['item']['artists'][0]['name']
    album = cur_track['item']['album']['name']
    return jsonify([{
        'name': name,
        'artist': artist,
        'album': album
    }])


@app.route('/graphs/<time_range>/<token>')
def user_graph(time_range, token):
    n2v = Node2VecModel('model_kv.kv', token=token)
    labels = []
    scores = []
    colors = []
    labels, scores,colors = n2v.get_mappings_by_range(token, time_range)
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
