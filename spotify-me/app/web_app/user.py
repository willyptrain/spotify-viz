import networkx as nx
import matplotlib.pyplot as plt
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
from numpy import linalg
import random
import plotly.graph_objs as go
import pandas as pd
import spotipy.util as util
import pprint


class User:
    def __init__(self, token):
        sp = spotipy.Spotify(auth=token)
        scope = 'user-top-read'
        self.token = token
        # self.token = util.prompt_for_user_token(username, scope=scope,redirect_uri='http://localhost:5000')
        if(not self.token):
            print("Could not get token")
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
                        song_dict = {'name':result['name'], 'artist':result['artists'][0]['name']}
                        self.top_tracks[range].append(song_dict)

        return self.top_tracks

    def get_top_artists(self, term=None, limit=10):
        artist_info = {}
        if self.token:
            sp = spotipy.Spotify(auth=self.token)
            sp.trace = False
            if(not term):
                ranges = ['short_term', 'medium_term', 'long_term']
                for range in ranges:
                    artist_info[range] = []
                    results = sp.current_user_top_artists(time_range=range, limit=limit)
                    for i, result in enumerate(results['items']):
                        # print(json.dumps(result,indent=4))
                        artist_info[range].append({
                            'name': result['name'],
                            'index':i+1,
                            'popularity':result['popularity'],
                            'genres':result['genres']
                        })
                        # print(i, result)#['name'], '//', result['artists'][0]['name'])
        #                 song_dict = {'name':result['name'], 'artist':result['artists'][0]['name']}
        #                 self.top_tracks[range].append(song_dict)
        #
        # print(json.dumps(self.top_tracks,indent=4))
        # return self.top_tracks
        return artist_info


# user.get_top_tracks()