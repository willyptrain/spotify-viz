import spotipy
from spotipy.oauth2 import SpotifyClientCredentials


sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())






#nodes = artist's tracks, neighborhood=artist or genre (genre could also be class label to be predicted), edges=features of the songs, maybe artist -> neighborhood compression
#center node = artist (surrounding nodes are directed toward the artist)
#or maybe neighborhood is given a label, which corresponds to genre of the neighborhood's artist


