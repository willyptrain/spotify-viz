import functools
import requests
from urllib.parse import quote

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, json, jsonify, make_response
)
from werkzeug.security import check_password_hash, generate_password_hash

from .settings import spotify_id, spotify_secret
from .db import get_db
from flask_cors import CORS, cross_origin

bp = Blueprint('auth', __name__, url_prefix='/auth')

# Spotify URLS
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)

# Server-side Parameters
#REDIRECT_URI = "http://localhost:3000/login"
REDIRECT_URI = "https://www.spotipie.com/login"
SCOPE = "user-library-modify, streaming, user-top-read, user-read-private, user-read-currently-playing, user-library-read, user-read-recently-played, user-read-playback-position, playlist-modify-public, playlist-read-private"
STATE = ""
SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()

auth_query_parameters = {
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPE,
    # "state": STATE,
    # "show_dialog": SHOW_DIALOG_str,
    "client_id": spotify_id
}


def get_auth_header(token):
    return {"Authorization": "Bearer {}".format(token)}


def auth_payload(token):
    return {
        "grant_type": "authorization_code",
        "code": str(token),
        "redirect_uri": REDIRECT_URI,
        "client_id": spotify_id,
        "client_secret": spotify_secret,
    }

cur_id = None


def get_user_profile(token):
    user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)
    profile_response = requests.get(
        user_profile_api_endpoint, headers=get_auth_header(token)
    )
    
    return json.loads(profile_response.text)


@bp.route("/redirect-spotify")
def index():
    url_args = "&".join(["{}={}".format(key, quote(val))
                         for key, val in auth_query_parameters.items()])
    auth_url = "{}/?{}".format(SPOTIFY_AUTH_URL, url_args)
    return auth_url


@bp.route('/user', methods=('GET', 'POST'))
@cross_origin()
def get_user():
    global cur_id
    access_token = ''

    if request.method == 'POST':
        data = request.json
        auth_token = data['code']

        post_request = requests.post(SPOTIFY_TOKEN_URL, data=auth_payload(auth_token))
        response_data = json.loads(post_request.text)
        access_token = response_data["access_token"]
        refresh_token = response_data["refresh_token"]
    else:
        access_token = get_access_token(cur_id)
    profile_data = get_user_profile(access_token)

    if 'error' in profile_data:
        return 'Not logged in'

    cur_id = profile_data['id']

    create_user(profile_data, access_token, refresh_token)
    print(type(profile_data))
    profile_data['access_token'] = access_token
    res = make_response(jsonify(profile_data), 200)
    res.set_cookie('access_token', access_token)

    return res

def get_access_token(user_id):
    db = get_db()
    token = db.execute(
            'SELECT access_token FROM users WHERE spotify_id = ?', (user_id,)
    ).fetchone()
    print(token)
    return token

def create_user(data, access_token, refresh_token=""):
    db = get_db()
    

    if db.execute(
            'SELECT spotify_id FROM users WHERE spotify_id = ?', (data['id'],)
    ).fetchone() is None:
        print(data['images'])
        if data['images'] != []:
            db.execute(
                'INSERT INTO users (spotify_id, full_name, display_image, access_token, refresh_token, favorites_playlist) VALUES (?, ?, ?, ?, ?, ?)',
                (data['id'], data['display_name'], data['images'][0]['url'], access_token, refresh_token, 'None')
            )
        else:
            db.execute(
                'INSERT INTO users (spotify_id, full_name, display_image, access_token, refresh_token, favorites_playlist) VALUES (?, ?, ?, ?, ?, ?)',
                (data['id'], data['display_name'],
                 'https://f0.pngfuel.com/png/981/645/default-profile-picture-png-clip-art.png', access_token, refresh_token, 'None')
            )
        db.commit()


@bp.before_app_request
def load_logged_in_user():
    global cur_id
    if cur_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM users WHERE spotify_id = ?', (cur_id,)
        ).fetchone()


@bp.route('/logout')
def logout():
    global cur_id
    cur_id = None
    session.clear()
    return 'True'