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
import string
import pandas as pd
import csv


# use t_nse for better clustering
        #     then save the clustered graph as dataset, make a bunch of datasets?
        # so idea is to use these features: danceability, etc to learn the positions*** of the nodes,
        #     the edges is the easy part because we can just connect by artist recommendations
        #     step 1:
        #         create dataset: columns: artist, danceability, energy, etc. and then label: genre



class Data:

    def __init__(self):
        self.lookup = Lookup()
        self.sp = self.lookup.sp
        self.df = pd.DataFrame()
        self.metadata_df = {"artist":[], "genre":[]}

    #creates dataset from random artists
    #organizes the data into pandas dataframe so it can be fed to tensorflow's
    # embedding projector: https://projector.tensorflow.org/
    def create_dataset(self):
        k = 50
        self.df = {
            "danceability": [],
            "energy": [],
            "key": [],
            "loudness": [],
            "mode": [],
            "speechiness": [],
            "acousticness": [],
            "instrumentalness": [],
            "liveness": [],
            "valence": [],
            "tempo": []
        }

        for i in range(0, 26):
            search = self.random_lookup(string.ascii_lowercase[i])
            for artist in search["artists"]["items"]:
                name = artist['name']
                genres = artist['genres']
                get_features = self.lookup.get_top_k_track_info(artist['name'], k)
                for key, value in get_features.items():
                    self.df[key] += value
                    k = len(value)
                self.metadata_df["artist"] += [name for i in range(0, k)]
                if(len(genres) > 0):
                    self.metadata_df["genre"] += [genres[0] for i in range(0, k)]
                else:
                    self.metadata_df["genre"] += ["N/A" for i in range(0, k)]

        self.df = pd.DataFrame(self.df)
        self.metadata_df = pd.DataFrame(self.metadata_df)

    def random_lookup(self, char):
        return self.lookup.get_artist(char)





d = Data()
d.create_dataset()
d.df.to_csv('take2.tsv',index=False,sep='\t', quoting=csv.QUOTE_NONE)
d.metadata_df.to_csv('take2_metadata.tsv',sep='\t', quoting=csv.QUOTE_NONE)
