from flask import Flask
from web_app.settings import spotify_secret, spotify_id
from flask_material import Material
from flask import Flask
import os

app = Flask(__name__)
# material = Material(app)
app.config['SECRET_KEY'] = spotify_secret
app.config['SPOTIFY_CLIENT_SECRET'] = spotify_secret


os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


from web_app import routes
