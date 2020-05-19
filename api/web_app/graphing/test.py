import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd
import json
import matplotlib.pyplot as plt
import numpy as np
import math
import random

sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())


results = sp.search(q="darwin deez", limit=50)
tracks = []
for i, t in enumerate(results['tracks']['items']):
    print(' ', i, t['name'])
    tracks.append(t['uri'])

features = sp.audio_features(tracks)
for feature in features:
    print(json.dumps(feature, indent=4))
    print()
    analysis = sp._get(feature['analysis_url'])
    print(json.dumps(analysis, indent=4))
    print()