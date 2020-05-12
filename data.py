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
        self.metadata_df = {"artist":[], "generic genre":[], "genre":[], "color":[], "recommended_by":[], "track_num": []}
        self.genre_list = ["rap", "country", "hip hop", "pop", "alternative", "indie", "rock",
                           "metal", "latin", "r&b"]

    #creates dataset from random artists
    #organizes the data into pandas dataframe so it can be fed to tensorflow's
    # embedding projector: https://projector.tensorflow.org/
    def create_dataset(self, combine=False, k1=10, k2=10):
        self.df = {
            "track_names":[],
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
            print(i)
            k1 = k1
            for artist in search["artists"]["items"]:
                name = artist['name']
                genres = artist['genres']
                get_features = self.lookup.get_top_k_track_info(name, k1)
                for key, value in get_features.items():
                    self.df[key] += value
                    k1 = len(value)
                self.metadata_df["artist"] += [name for i in range(0, k1)]
                self.metadata_df["track_num"] += [i for i in range(0, k1)]
                self.metadata_df["recommended_by"] += [name for i in range(0, k1)]
                if(len(genres) > 0):
                    generic_genre = self.get_generic_genre(genres)
                    index_genre = self.genre_list.index(generic_genre)+1
                    self.metadata_df["generic genre"] += [generic_genre for i in range(0, k1)]
                    self.metadata_df["genre"] += [genres[0] for i in range(0, k1)]
                    self.metadata_df["color"] += [index_genre for i in range(0, k1)]
                else:
                    self.metadata_df["generic genre"] += ["N/A" for i in range(0, k1)]
                    self.metadata_df["genre"] += ["N/A" for i in range(0, k1)]
                    self.metadata_df["color"] += [0 for i in range(0, k1)]

                if(name != '' and name != None):
                    k2 = k2
                    try:
                        recommended_tracks = self.lookup.get_recommendations(name, k2)
                        # for track in recommended_tracks:
                        recommended_artist = [track.by_artist for track in recommended_tracks]
                        for new_artist in recommended_artist:
                            get_features = self.lookup.get_top_k_track_info(name, k2)
                            for key, value in get_features.items():
                                self.df[key] += value
                                k2 = len(value)
                            self.metadata_df["artist"] += [new_artist for i in range(0, k2)]
                            self.metadata_df["track_num"] += [i for i in range(0, k2)]
                            self.metadata_df["recommended_by"] += [name for i in range(0, k2)]

                            if (len(genres) > 0):
                                index_genre = self.genre_list.index(generic_genre) + 1
                                generic_genre = self.get_generic_genre(genres)
                                self.metadata_df["generic genre"] += [generic_genre for i in range(0, k2)]
                                self.metadata_df["genre"] += [genres[0] for i in range(0, k2)]
                                self.metadata_df["color"] += [index_genre for i in range(0, k2)]
                            else:
                                self.metadata_df["generic genre"] += ["N/A" for i in range(0, k2)]
                                self.metadata_df["genre"] += ["N/A" for i in range(0, k2)]
                                self.metadata_df["color"] += [0 for i in range(0, k2)]
                    except:
                        print("Could not get tracks for: ", name)

        self.df = pd.DataFrame(self.df)
        self.metadata_df = pd.DataFrame(self.metadata_df)
        if(combine):
            self.df = self.df.join(self.metadata_df)


    def get_generic_genre(self, genres):
        for genre in genres:
            for generic in self.genre_list:
                if(generic in genre):
                    return generic
        else:
            self.genre_list.append(genres[0])
            return genres[0]


    def random_lookup(self, char):
        return self.lookup.get_artist(char)





d = Data()
d.create_dataset(True,50,50)


d.df.to_csv('data/recommendations_k50.csv',index=False)
# d.df.to_csv('recommendations_k20_meta.csv',index=False)
# d.metadata_df.to_csv('recommendations_metadata.tsv',sep='\t', quoting=csv.QUOTE_NONE)
# d.df.to_csv('recommendations_tsv.tsv',sep='\t', quoting=csv.QUOTE_NONE,index=False)
