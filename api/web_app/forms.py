from wtforms import StringField
from flask_wtf import FlaskForm

class AlbumForm(FlaskForm):
    album_list = StringField('Album List')

class ArtistForm(FlaskForm):
    artist_list = StringField('Artist List')