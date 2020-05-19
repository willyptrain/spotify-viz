from wtforms import StringField
from flask_wtf import FlaskForm

class AlbumForm(FlaskForm):
    album_list = StringField('Album List')