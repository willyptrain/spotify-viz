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
                get_features = self.lookup.get_top_k_track_info(name, k)
                for key, value in get_features.items():
                    self.df[key] += value
                    k = len(value)
                self.metadata_df["artist"] += [name for i in range(0, k)]
                if(len(genres) > 0):
                    self.metadata_df["genre"] += [genres[0] for i in range(0, k)]
                else:
                    self.metadata_df["genre"] += ["N/A" for i in range(0, k)]

                if(name != '' and name != None):
                    k = 50
                    try:
                        recommended_tracks = self.lookup.get_recommendations(name, k)
                        # for track in recommended_tracks:
                        recommended_artist = [track.by_artist for track in recommended_tracks]
                        for name in recommended_artist:
                            get_features = self.lookup.get_top_k_track_info(name, k)
                            for key, value in get_features.items():
                                self.df[key] += value
                                k = len(value)
                            self.metadata_df["artist"] += [name for i in range(0, k)]
                            if (len(genres) > 0):
                                self.metadata_df["genre"] += [genres[0] for i in range(0, k)]
                            else:
                                self.metadata_df["genre"] += ["N/A" for i in range(0, k)]
                    except:
                        print("Could not get tracks for: ", name)

        self.df = pd.DataFrame(self.df)
        self.metadata_df = pd.DataFrame(self.metadata_df)
        self.df = self.df.join(self.metadata_df)



    def random_lookup(self, char):
        return self.lookup.get_artist(char)





d = Data()
d.create_dataset()
print(d.df)

# d.df.to_csv('dataset2_large.csv',index=False)
# d.metadata_df.to_csv('take2_metadata.tsv',sep='\t', quoting=csv.QUOTE_NONE)
