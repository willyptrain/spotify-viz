from flask import Flask
from .settings import spotify_secret, spotify_id
from flask import Flask
import os
from flask_cors import CORS

def create_app():
    app = Flask(__name__.split('.')[0], static_folder='../client/build', static_url_path="")
    app.config['SECRET_KEY'] = spotify_secret
    app.config['SPOTIFY_CLIENT_SECRET'] = spotify_secret
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
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
    def index():
        return app.send_static_file('index.html/login')


    @app.route('/favicon.ico', methods=["GET"])
    def favicon():
        return app.send_static_file('favicon.ico')
    return app