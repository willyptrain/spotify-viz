from music import Lookup, Track
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
from numpy import linalg
import random
import math
import os
from lists import items
# import node2vec as n2v
from gensim.models import KeyedVectors
from user import User
from urllib3.exceptions import ReadTimeoutError
import time


class Node2Vec:
    def __init__(self):
        self.wv = self.load_wv('model_kv.kv')
        self.lists = items()
        self.top_genres = self.lists.top_genres()
        client_credentials_manager = SpotifyClientCredentials()
        sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    def get_genre_mappings(self, username, k=100, range=None):
        if(self.wv == None):
            raise Exception("No Keyed Vector found")
        else:
            user = User(username)
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
                    total = float(sum(genre_mappings[range].values()))
                    print(range.upper())
                    for genre in sorted_mappings[range]:
                        print(genre, float(genre[1]) / total)  # , int(genre[1]),int(minimum))

                return genre_mappings

    def get_mappings_by_range(self, token, range, k=50):
        scores = []
        colors = []
        pretransform_scores = []
        labels = []
        print()
        print()
        print()
        print("dab1")
        print()
        user = User(token)
        print()
        print()
        print()
        print("dab2")
        print()
        top_artists = user.get_top_artists(limit=k)
        print()
        print()
        print("yeet")
        print()
        print()


        genre_mappings = {"short_term": {}, "medium_term": {}, "long_term": {}}
        sorted_mappings = {"short_term": {}, "medium_term": {}, "long_term": {}}
        for artist in top_artists[range]:
            for user_genre in artist["genres"][0:2]:
                for genre in self.top_genres:
                    try:
                        similarity = self.wv.similarity(user_genre, genre)
                        if (genre in genre_mappings[range]):
                            genre_mappings[range][genre] += similarity
                        else:
                            genre_mappings[range][genre] = similarity
                    except:
                        continue
            pretransform_scores.append(genre_mappings[range][genre])

        mean = np.mean(pretransform_scores)
        lambda_coef = 1 / float(mean)
        sorted_mappings[range] = sorted(genre_mappings[range].items(), key=(lambda x: x[1]), reverse=True)
        genre_order = {}
        for i, genre in enumerate(sorted_mappings[range]):
            genre_order[genre[0]] = i

        total = float(sum(genre_mappings[range].values()))
        for i, genre in enumerate(genre_mappings[range].items()):
            curr_genre = genre[0]
            curr_score = genre[1]
            index_of_genre = genre_order[curr_genre]
            power = -(index_of_genre + 1) * lambda_coef
            labels.append(curr_genre)
            scores.append(lambda_coef * (math.e ** (power)) * float(curr_score))
            colors.append("rgba(0," + str(random.randint(0, 255)) + ",255," + str(random.uniform(0, 1)) + ")")

        print(labels)
        print(scores)

        return [labels, scores]

    def load_wv(self, path):
        wv = KeyedVectors.load(path, mmap='r')
        return wv



# node2 = Node2Vec()
# node2.get_mappings_by_range("screamywill", range="short_term")