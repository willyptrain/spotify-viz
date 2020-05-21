import tekore as tk
import os


client_id = os.environ['SPOTIPY_CLIENT_ID']
client_secret = os.environ['SPOTIPY_CLIENT_SECRET']
# redirect_uri = "http://localhost:8888/callback"
redirect_uri = 'http://0.0.0.0:8000/callback'

conf = (client_id, client_secret, redirect_uri)
token = tk.prompt_for_user_token(*conf, scope=tk.scope.every)

spotify = tk.Spotify(token)
tracks = spotify.current_user_top_tracks(limit=10)
spotify.playback_start_tracks([t.id for t in tracks.items])