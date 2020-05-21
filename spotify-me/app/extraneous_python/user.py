import networkx as nx
import matplotlib.pyplot as plt
from music import Lookup, Track
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
from numpy import linalg
import random
import plotly.graph_objs as go
import pandas as pd
from spotify_graph import music_graph
import spotipy.util as util
import pprint


class User:
    def __init__(self, username):
        client_credentials_manager = SpotifyClientCredentials()
        sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
        scope = 'user-top-read'
        self.token = util.prompt_for_user_token(username, scope=scope,redirect_uri='http://localhost:8888')
        if(not self.token):
            print("Could not get token")
        print(self.token)
        self.top_tracks = {'short_term':[], 'medium_term':[], 'long_term':[]}


    def get_top_tracks(self, term=None, limit=10):
        if self.token:
            sp = spotipy.Spotify(auth=self.token)
            sp.trace = False
            if(not term):
                ranges = ['short_term', 'medium_term', 'long_term']
                for range in ranges:
                    results = sp.current_user_top_tracks(time_range=range, limit=limit)
                    for i, result in enumerate(results['items']):
                        # print(i, item['name'], '//', item['artists'][0]['name'])
                        song_dict = {'name':result['name'], 'artist':result['artists'][0]['name']}
                        self.top_tracks[range].append(song_dict)

        print(json.dumps(self.top_tracks,indent=4))
        return self.top_tracks


user = User("screamywill")
# user.get_top_tracks()