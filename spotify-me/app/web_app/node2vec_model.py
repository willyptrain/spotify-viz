import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
from numpy import linalg
import random
import math
import os
from gensim.models import KeyedVectors
from . import lists
from web_app.lists import items
import node2vec as n2v
from web_app.user import User
from flask import jsonify

from urllib3.exceptions import ReadTimeoutError
import time
# from lists import items


class Node2VecModel:
    def __init__(self, path, token):
        self.wv = self.load_wv(path)
        self.lists = items()
        self.top_genres = self.lists.top_genres()
        self.big_list_genres = self.lists.get_genres()
        self.sp = spotipy.Spotify(auth=token)

    def get_genre_mappings(self, token, k=100, range=None):
        if(self.wv == None):
            raise Exception("No Keyed Vector found")
        else:
            user = User(token)
            top_artists = user.get_top_artists(limit=k)
            genre_mappings = {"short_term": {}, "medium_term": {}, "long_term": {}}
            sorted_mappings = {"short_term": {}, "medium_term": {}, "long_term": {}}
            ranges = ["short_term", "medium_term", "long_term"]
            if(not range):
                for range in ranges:
                    for artist in top_artists[range]:
                        for user_genre in artist["genres"]:
                            for genre in self.top_genres:
                                try:
                                    similarity = self.wv.similarity(user_genre, genre)
                                    if (genre in genre_mappings[range]):
                                        genre_mappings[range][genre] += similarity
                                    else:
                                        genre_mappings[range][genre] = similarity
                                except:
                                    continue

                    sorted_mappings[range] = sorted(genre_mappings[range].items(), key=(lambda x: x[1]), reverse=True)
                    total = float(sum( [i for i in genre_mappings[range].values()]  ))

                return genre_mappings

    def get_mappings_by_range(self, token, range, k=50):
        print(self.get_genre_mappings(token))
        scores = []
        colors = []
        pretransform_scores = []
        labels = []
        user = User(token)
        top_artists = user.get_top_artists(limit=k)
        genre_mappings = {"short_term": {}, "medium_term": {}, "long_term": {}}
        sorted_mappings = {"short_term": {}, "medium_term": {}, "long_term": {}}
        for artist in top_artists[range]:
            for user_genre in artist["genres"][0:2]:
                for genre in self.top_genres:
                    try:
                        similarity = self.wv.similarity(user_genre, genre)
                        if (genre in genre_mappings[range]):
                            genre_mappings[range][genre] += min(0, 0.5-similarity)
                        else:
                            genre_mappings[range][genre] = min(0, 0.5-similarity)
                    except:
                        continue
            pretransform_scores.append(genre_mappings[range][genre])

        mean = np.mean(pretransform_scores)
        lambda_coef = 1 / float(mean)
        sorted_mappings[range] = sorted(genre_mappings[range].items(), key=(lambda x: x[1]), reverse=True)
        genre_order = {}
        for i, genre in enumerate(sorted_mappings[range]):
            genre_order[genre[0]] = i

        # total = float(sum(genre_mappings[range].values()))
        total = float(sum([math.e ** (i) for i in genre_mappings[range].values()]))
        for i, genre in enumerate(genre_mappings[range].items()):
            curr_genre = genre[0]
            curr_score = genre[1]
            index_of_genre = genre_order[curr_genre]
            power = -(index_of_genre + 1) * lambda_coef
            labels.append(curr_genre)
            scores.append((lambda_coef * (math.e ** (power)) * float(curr_score)))
            colors.append("rgba(0," + str(random.randint(0, 255)) + ","+str(random.randint(0, 255))+"," + str(random.uniform(0, 1)) + ")")

        return [labels, scores,colors]


    def get_mappings_for_genres(self, genres, k=50):
        scores = []
        colors = []
        labels = []
        genre_mappings = {}
        sorted_mappings = {}

        for user_genre in genres:
            for genre in self.big_list_genres:
                try:
                    similarity = self.wv.similarity(user_genre, genre)
                    if (genre in genre_mappings):
                        genre_mappings[genre] += similarity
                    else:
                        genre_mappings[genre] = similarity
                except Exception:
                    continue

        if(len(genre_mappings.items()) > 0):
            sorted_mappings = sorted(genre_mappings.items(), key=(lambda x: x[1]), reverse=True)
            top_genre = sorted_mappings[0][0]
            artist_genres = {}
            sum_similarities = 0
            scores = []
            for artist_genre in genres:
                similarity = self.wv.similarity(artist_genre, top_genre)
                sum_similarities += similarity
                artist_genres[artist_genre] = similarity
                scores.append(similarity)

            avg_score = sum_similarities/(len(genres))
            st_dev = np.std(np.array(scores))

            labels = []
            scores = []
            colors = []

            for artist_genre in artist_genres.items():
                labels.append(artist_genre[0])
                if (st_dev != 0):
                    scores.append(abs(artist_genre[1]-avg_score)/st_dev)
                else:
                    scores.append(artist_genre[1])
                colors.append("rgba(0,0,"+str(random.randint(0, 255))+"," + str((random.uniform(0, 1)*0.8)+0.2) + ")")

            print(labels, scores, colors)
            return [labels, scores, colors]
        else:
            return [[],[],[]]



    def get_mappings_for_artist(self, artist_id):
        artist_tracks = self.sp.artist_top_tracks(artist_id)["tracks"]
        for track in artist_tracks:
            id = track["id"]
            features = self.sp.track(id)
            print(json.dumps(features,indent=4))



    def load_wv(self, path):
        wv = KeyedVectors.load(path, mmap='r')
        return wv

<<<<<<< HEAD
    def get_mappings_for_artist(self, artist_id):
        artist_tracks = self.sp.artist_top_tracks(artist_id)["tracks"]
        for track in artist_tracks:
            id = track["id"]
            features = self.sp.track(id)
            print(json.dumps(features,indent=4))
=======

# node2 = Node2VecModel("model_kv.kv")
# print(json.dumps(node2.sp.album('2MbEjelAESGKIBDL54OYeY'),indent=4))
>>>>>>> origin/new_will2
