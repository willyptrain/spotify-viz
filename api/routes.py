from flask import redirect, url_for, session, render_template, request, jsonify
from flask_dance.contrib.spotify import spotify, make_spotify_blueprint
import tekore as tk
from flask_session import Session
from oauthlib.oauth2.rfc6749.errors import TokenExpiredError
import spotipy
import json
import webbrowser
from . import lists, user, node2vec_model
from .settings import spotify_id, spotify_secret
import math
# from settings import spotify_secret, spotify_id
# import node2vec_model
from .node2vec_model import Node2VecModel
from .lists import items
from .user import User
from spotipy.exceptions import SpotifyException
import spotipy.util as util
import numpy as np
from . import db

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, json, jsonify, make_response
)


bp_api = Blueprint('api', __name__, url_prefix='/api')

@bp_api.route('/user/<time_range>/<token>/<k>/')
def user_tracks(time_range, token, k=50):
    k = int(k)
    top_tracks = []
    image_url = 'https://via.placeholder.com/150'
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
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


@bp_api.route('/user_albums/<time_range>/<token>/<k>/')
def user_albums(time_range, token, k=50):
    k = int(k)
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




@bp_api.route('/artist/<id>/<token>')
def artist_page(id, token):
    sp = spotipy.Spotify(auth=token)

    return jsonify({
        'info':sp.artist(id),
        'albums':sp.artist_albums(id)
    })


@bp_api.route('/artist_graph/<id>/<token>')
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

@bp_api.route('/user_info/<token>/')
def user_info(token):
    sp = spotipy.Spotify(auth=token)
    user_info = sp.current_user()
    try:
        image_url = user_info['images'][0]['url']
    except:
        image_url = "https://f0.pngfuel.com/png/981/645/default-profile-picture-png-clip-art.png"
    subscription = user_info['product']
    user_id = user_info['id']
    user_url = user_info['external_urls']['spotify']
    username = user_info['display_name']
    followers = user_info['followers']


    top_recent_artists = sp.current_user_top_artists(time_range="short_term", limit=50)
    top_all_artists = sp.current_user_top_artists(time_range="long_term", limit=50)





    all_artist_genres = [genre for result in top_all_artists['items'] for genre in result['genres']]
    u, count = np.unique(all_artist_genres, return_counts=True)

    long_arg_sort = np.argsort(-count)
    long_term_genres = u[long_arg_sort]
    long_genre_values = sorted(count,reverse=True, key=lambda x: int(x))



    recent_artist_genres = [genre for result in top_recent_artists['items'] for genre in result['genres']]
    u, count = np.unique(recent_artist_genres, return_counts=True)

    short_genre_values = np.argsort(-count)
    short_term_genres = u[short_genre_values]
    short_genre_values = sorted(count,reverse=True, key=lambda x: int(x))


        
    return jsonify([{
        'username' :username,
        'followers':followers,
        'user_url' : user_url,
        'user_id' : user_id,
        'subscription' : subscription,
        'image_url' : image_url,
        'short_term_genres' : list(short_term_genres),
        'short_genre_scores': list(map(int,short_genre_values)),
        'long_genre_scores':list(map(int,long_genre_values)),
        'long_term_genres' : list(long_term_genres),
    }])



@bp_api.route('/album_track_info/<album>/<token>')
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
        'previews':previews,
        'track_names':track_names,
        'audio': previews,
        'username': sp.me()['display_name']
    }


@bp_api.route('/track/save/<tracks>/<username>/<token>')
def save_track(tracks, username,token):

    # new_token = spotipy.util.prompt_for_user_token(username,scope="user-library-modify",client_id=spotify_id,
    #                                        client_secret=spotify_secret,
    #                                        redirect_uri="https://spot-viz.herokuapp.com/login")
    sp = spotipy.Spotify(auth=token)
    add = sp.current_user_saved_tracks_add([tracks])

    return "successful"



# """
# def search(self, q, limit=10, offset=0, type="track", market=None):
#         """ searches for an item
#             Parameters:
#                 - q - the search query (see how to write a query in the
#                       official documentation https://developer.spotify.com/documentation/web-api/reference/search/search/)  # noqa
#                 - limit  - the number of items to return (min = 1, default = 10, max = 50)
#                 - offset - the index of the first item to return
#                 - type - the type of item to return. One of 'artist', 'album',
#                          'track', 'playlist', 'show', or 'episode'
#                 - market - An ISO 3166-1 alpha-2 country code or the string
#                            from_token.
#         """
#
# """


@bp_api.route('/track/search/<keyword>/<token>')
def search_tracks(keyword, token):
    sp = spotipy.Spotify(auth=token)
    query = keyword.replace(" ", "%20")
    limit = 10
    type="track"
    search = sp.search(q=query, limit=limit, type=type)
    artist_info = []
    for k in search['tracks']['items']:
        artist = k['artists'][0]['id']
        artist_info.append(sp.artist(artist))
    return {
        'search': search,
        'artist_info':artist_info
    }







@bp_api.route('/album/<album>/<token>')
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


@bp_api.route('/track/<track>/<token>')
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


@bp_api.route('/related_albums/<track>/<token>')
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

@bp_api.route('/related_tracks/<track>/<token>')
def related_tracks(track, token):
    sp = spotipy.Spotify(auth=token)
    user_id = sp.me()['id']
    recommendations = sp.recommendations(seed_artists=[track])
    artists = []
    images = []
    song_names = []
    previews = []
    ids = []
    in_favorites = []
    playlist_id = get_favorites_playlist_id(user_id)
    print("playlist_id")
    for result in recommendations["tracks"]:
        track = sp.track(result["id"])
        ids.append(result["id"])
        previews.append(track["preview_url"])
        artist = result['artists'][0]['name']
        name = result['name']
        artists.append(artist)
        song_names.append(name)
        images.append(result["album"]["images"][0]["url"])
        if playlist_id != None:
            track_in_favs = song_in_playlist(result['id'], playlist_id, token)
            in_favorites.append(track_in_favs)
        else:
            in_favorites.append(False)
    print(in_favorites)
    return jsonify({
        'artists':artists,
        'song_names':song_names,
        'images':images,
        'audio':previews,
        'ids':ids,
        'username': sp.me()['display_name'],
        'in_favorites': in_favorites,
    })

@bp_api.route('/user_artists/<time_range>/<token>/<k>/')
def user_artists(time_range, token, k=50):
    k = int(k)
    top_artists = []
    image_url = 'https://via.placeholder.com/150'
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
    range_nicknames = {"short_term":"This Week", "medium_term":"This Year", "long_term":"All Time"}
    results = sp.current_user_top_artists(time_range=time_range, limit=k)
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


@bp_api.route('/user_currently_playing/<token>/')
def get_currently_playing(token):
    sp = spotipy.Spotify(auth=token)
    cur_track = sp.current_user_playing_track()
    if(not cur_track):
        return jsonify([{
            'name': None,
            'artist': None,
            'album': None
        }])
    name = cur_track['item']['name']
    artist = cur_track['item']['artists'][0]['name']
    album = cur_track['item']['album']['name']
    return jsonify([{
        'name': name,
        'artist': artist,
        'album': album
    }])


@bp_api.route('/graphs/<time_range>/<token>')
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

# gets  playlist id for favorites in db
def get_favorites_playlist_id(user_id):
    the_db = db.get_db()
    playlist_id = the_db.execute(
            'SELECT favorites_playlist FROM users WHERE spotify_id = ?', (user_id,)
    ).fetchone()
    the_db.commit()
    return playlist_id['favorites_playlist']

def save_favorites_playlist_id(user_id, playlist_id):
    the_db = db.get_db()
    the_db.execute(
            '''UPDATE users SET favorites_playlist = ? WHERE spotify_id = ?''', (playlist_id, user_id)
    )
    the_db.commit()
    return True

def create_playlist(token, use="favorites", name="Spotipie Playlist",):
    sp = spotipy.Spotify(auth=token)
    user_id = sp.me()['id']
    if use == "favorites":
        playlist_id = get_favorites_playlist_id(user_id)
        print("playlist id from db", playlist_id)
        if playlist_id != None:
            try:
                sp.user_playlist(user=user_id, playlist_id=playlist_id)
            except:
                playlist_info = sp.user_playlist_create(user=user_id, name=name, public=True, description="My saved tracks from www.spotipie.com")
                playlist_id = playlist_info['id']
                save_favorites_playlist_id(user_id, playlist_id)
            return playlist_id
        else:
            playlist_info = sp.user_playlist_create(user=user_id, name=name, public=True, description="My saved tracks from www.spotipie.com")
            playlist_id = playlist_info['id']
            save_favorites_playlist_id(user_id, playlist_id)
            return playlist_id

    else:
        return 0

@bp_api.route('/save_to_playlist/<track_id>/<token>')
def save_to_playlist(track_id, token):
    print("yooo", track_id)
    sp = spotipy.Spotify(auth=token)
    user_id = sp.me()['id']
    playlist_id = create_playlist(use="favorites", name="Saved from Spotipie", token=token)
    sp.user_playlist_add_tracks(user=user_id, playlist_id=playlist_id, tracks=[track_id])
    return jsonify(0)

@bp_api.route('/save_to_db/<track_id>/<token>')
def save_to_db(track_id, token):
    print("yooo", track_id)
    sp = spotipy.Spotify(auth=token)
    user_id = sp.me()['id']
    the_db = db.get_db()
    fav_tracks = the_db.execute(
            'SELECT fav_tracks FROM users WHERE spotify_id = ?', (user_id,)
    ).fetchone()
    fav_tracks = fav_tracks['fav_tracks']
    if fav_tracks != None:
        fav_tracks = str(fav_tracks)
        fav_tracks += str(track_id) + " "
    elif track_id in fav_tracks:
        return jsonify(0)
    else:
        fav_tracks = str(track_id) + " "
    the_db.execute(
            '''UPDATE users SET fav_tracks = ? WHERE spotify_id = ?''', (fav_tracks, user_id)
    )
    the_db.commit()
    return jsonify(0)

@bp_api.route('/delete_from_db/<track_id>/<playlist_id>/<token>')
def delete_from_db(track_id, playlist_id, token):
    sp = spotipy.Spotify(auth=token)
    user_id = sp.me()['id']
    the_db = db.get_db()
    if playlist_id == "favorites":
        fav_tracks = the_db.execute(
            'SELECT fav_tracks FROM users WHERE spotify_id = ?', (user_id,)
        ).fetchone()
        fav_tracks = fav_tracks['fav_tracks']
        if str(track_id) + " " in fav_tracks:
            print(True)
        fav_tracks = fav_tracks.replace(str(track_id) + " ", "", 10)
        print("Fav_tracks", fav_tracks)
        the_db.execute(
            '''UPDATE users SET fav_tracks = ? WHERE spotify_id = ?''', (fav_tracks, user_id)
        )
        the_db.commit()
        return jsonify('finished')
    else:
        return jsonify(0)

@bp_api.route('/fetch_fav_tracks/<token>')
def fetch_fav_tracks(token):
    sp = spotipy.Spotify(auth=token)
    user_id = sp.me()['id']
    the_db = db.get_db()
    fav_tracks = the_db.execute(
            'SELECT fav_tracks FROM users WHERE spotify_id = ?', (user_id,)
    ).fetchone()
    fav_tracks = fav_tracks['fav_tracks']
    if fav_tracks == None:
        fav_tracks = []
        fav_tracks.append({
                'track_name':'Empty',
                'artist':'Empty',
                'uri':'Empty',
                'image':'Empty'
            })
        return jsonify(fav_tracks)
    else:
        all_tracks = fav_tracks.split()
        print(all_tracks)
        tracks = sp.tracks(tracks=all_tracks)['tracks']
        artists = []
        song_names = []
        images = []
        ids = []
        previews = []
        for i, result in enumerate(tracks):
            try:
                    song_names.append(result['name'])
                    artists.append(result['artists'][0]['name'])
                    images.append(result['album']['images'][0]['url'])
                    ids.append(result['id'])
                    previews.append(result['preview_url'])
            except:
                continue
    print(song_names)
    return jsonify(song_names=song_names, artists=artists, images=images, ids=ids, previews=previews, username=sp.me()['display_name'])


def song_in_playlist(track_id, playlist_id, token):
    sp = spotipy.Spotify(auth=token)
    user_id = sp.me()['id']
    if playlist_id == "favorites":
        playlist_id = get_favorites_playlist_id(user_id)
        if playlist_id != None:
            track_list = sp.user_playlist_tracks(user=user_id)
            track_info = sp.track(track_id)
            print("Track info", track_info)
            print("track list", track_list)
            if track_info in track_list:
                return True
            else:
                return False
    else:
        return False

@bp_api.route('/delete_from_playlist/<track_id>/<playlist_id>/<token>')
def delete_from_playlist(track_id, playlist_id, token):
    sp = spotipy.Spotify(auth=token)
    user_id = sp.me()['id']
    if playlist_id == "favorites":
        playlist_id = get_favorites_playlist_id(user_id)
        if playlist_id != None:
            sp.user_playlist_remove_all_occurrences_of_tracks(user=user_id, playlist_id=playlist_id, tracks=[track_id])
            return jsonify('finished')
        else:
            return jsonify(0)
    else:
        return jsonify(0)

@bp_api.route('/logout')
def spotify_logout():
    for key in list(session.keys()):
        session.pop(key)

    webbrowser.open_new('https://www.spotify.com/logout/')
    return redirect('https://www.spotify.com/logout/')



@bp_api.route('/unprotected')
def unprotected():
    return "You need some tokens!"


