from flask import Flask
from api.settings import spotify_secret, spotify_id
from flask_material import Material
from flask import Flask
import os
from flask_cors import CORS
app = Flask(__name__)
# material = Material(app)
app.config['SECRET_KEY'] = spotify_secret
app.config['SPOTIFY_CLIENT_SECRET'] = spotify_secret
CORS(app)
app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE='site.db',
    )


os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


from api import routes
from api import db
db.init_app(app)
from api import auth
app.register_blueprint(auth.bp)