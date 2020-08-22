from flask import Flask
from .settings import spotify_secret, spotify_id
from flask import Flask
import os
from flask_cors import CORS
from flask import render_template

def create_app():
    app = Flask(__name__.split('.')[0], static_folder='../client/build', static_url_path="")
    app.config['SECRET_KEY'] = spotify_secret
    app.config['SPOTIFY_CLIENT_SECRET'] = spotify_secret
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type, Access-Control-Allow-Origin'
    app.config.from_mapping(
            SECRET_KEY='dev',
            DATABASE='api/site.db',
        )
    app.url_map.strict_slashes = False

    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


    from . import db
    from . import auth
    from . import routes
    db.init_app(app)
    app.register_blueprint(auth.bp)
    app.register_blueprint(routes.bp_api)
    @app.route('/', methods=["GET"])
    def index():
        return app.send_static_file('index.html')

    @app.route('/login', methods=["GET"])
    def login():
        return app.send_static_file('index.html')

    @app.route('/dashboard', methods=["GET"])
    def dashboard():
        return app.send_static_file('index.html')
    
    @app.route('/top_albums', methods=["GET"])
    def top_albums():
        return app.send_static_file('index.html')
    
    @app.route('/top_tracks', methods=["GET"])
    def top_tracks():
        return app.send_static_file('index.html')
    
    @app.route('/top_artists', methods=["GET"])
    def top_artists():
        return app.send_static_file('index.html')

    @app.route('/logout', methods=["GET"])
    def logout():
        return app.send_static_file('index.html')
    
    @app.route('/favorites', methods=["GET"])
    def favorites():
        return app.send_static_file('index.html')
    
    @app.route('/track/<track_id>', methods=["GET"])
    def track(track_id):
        return render_template('index.html', track_id=track_id)
    
    @app.route('/recommended', methods=["GET"])
    def recommendations():
        return app.send_static_file('index.html')
    
    @app.route('/<path:page>')
    def fallback(page):
        return app.send_static_file('index.html')


    @app.route('/favicon.ico', methods=["GET"])
    def favicon():
        return app.send_static_file('favicon.ico')
    return app