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
import math
import os
from tensorflow_tsne import tsne
from lists import items
import node2vec as n2v
from gensim.models import KeyedVectors
from user import User
from urllib3.exceptions import ReadTimeoutError
import time


def get_generic_top_genre(genre):
    for gen in top_genres:
        if(gen in genre):
            return gen
    return None


client_credentials_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

item = items()

all_genres = item.get_genres()

k = 100
artists = {}
features_by_genre = {}
g = nx.Graph()
colors = item.get_colors()
# split = len(colors)
all_genres = all_genres#[0:split]
select_genres = item.select_genres()#[0:split]
top_genres = item.top_genres()#[0:split]
avg_popularity = {}

def construct_graph(save=False, path=""):
    average = 0
    now = 0
    for i, genre in enumerate(all_genres):
        if(i > 0):
            curr = time.time()
            average = ((average*(i-1) + curr-now)/(i))
            print("Time Elapsed,", curr-now, "seconds; Expected Remaining Time:", average*(len(all_genres)-i)/3600, "hours")
        now = time.time()
        print(i, len(g.nodes()), len(g.edges()))
        g.add_node(genre, genre=genre, color=colors[i][:-1])
        recommendation = sp.recommendations(seed_genres=[genre], limit=k)
        artists[genre] = []
        avg_popularity[genre] = 0
        for w in range(0, len(recommendation["tracks"])):
            current_id = recommendation["tracks"][w]["artists"][0]["id"]
            related_artists = sp.artist_related_artists(current_id)["artists"]
            avg_popularity[genre] += recommendation["tracks"][w]["popularity"]
            current_ = recommendation["tracks"][w]["artists"][0]
            related_artists.insert(0, current_)
            for i, artist in enumerate(related_artists):
                artist_name = artist["name"]
                artist_id = artist["id"]
                artist_uri = artist["uri"]
                try:
                    artist_info = sp.artist(artist_uri)
                    if(len(artist_info['genres']) > 0):
                        artists[genre].append({
                            'artist':artist_name,
                            'id': artist_id,
                            'uri': artist_uri,
                            'generic_genre':genre,
                            'genres':artist_info['genres'],
                            'popularity':recommendation["tracks"][w]["popularity"]
                        })
                    for feat in artist_info['genres'][0:4]:
                        g.add_node(feat, genre=feat, color=colors[i][:-1])
                        g.add_edge(genre, feat)
                        generic_top_genre = get_generic_top_genre(feat)
                        if(generic_top_genre != None):
                            g.add_edge(generic_top_genre, feat)




                # new_rec = sp.recommendations(seed_artists=[artist_uri], limit=50)
                # for x in range(0, len(new_rec["tracks"])):
                #     artist_name = new_rec["tracks"][x]["artists"][0]["name"]
                #     artist_id = new_rec["tracks"][x]["artists"][0]["id"]
                #     artist_uri = new_rec["tracks"][x]["artists"][0]["uri"]
                #     artist_info = sp.artist(artist_uri)
                #     if (len(artist_info['genres']) > 0):
                #         artists[genre].append({
                #             'artist': artist_name,
                #             'id': artist_id,
                #             'uri': artist_uri,
                #             'generic_genre': genre,
                #             'genres': artist_info['genres'],
                #             'popularity': new_rec["tracks"][x]["popularity"]
                #         })
                #     for feat2 in artist_info['genres'][0:4]:
                #         g.add_node(feat2, genre=feat2, color=colors[i][:-1])
                #         g.add_edge(genre, feat2)
                #         generic_top_genre = get_generic_top_genre(feat2)
                #         if (generic_top_genre != None):
                #             g.add_edge(generic_top_genre, feat2)
                except ReadTimeoutError:
                    print("Error for ", artist_name)
                    continue



        if(len(recommendation["tracks"]) > 0):
            avg_popularity[genre] = avg_popularity[genre]/len(recommendation["tracks"])
        else:
            avg_popularity[genre] = 0
        g.nodes[genre]['popularity'] = avg_popularity[genre]
    # print(complete_list_genres)

    if(save and path != ""):
        nx.write_gpickle(g, path=path)

def add_nodes_for_genre(genre, g, save_as=None):
    recommendation = sp.recommendations(seed_genres=[genre], limit=50)
    for w in range(0, len(recommendation["tracks"])):
        print(w, len(recommendation["tracks"]))
        current_id = recommendation["tracks"][w]["artists"][0]["id"]
        try:
            related_artists = sp.artist_related_artists(current_id)["artists"]
            current_ = recommendation["tracks"][w]["artists"][0]
            related_artists.insert(0, current_)
            for i, artist in enumerate(related_artists[0:25]):
                artist_name = artist["name"]
                artist_id = artist["id"]
                artist_uri = artist["uri"]
                # artist_info = sp.artist(artist_uri)
                # if (len(artist_info['genres']) > 0):
                #     artists[genre].append({
                #         'artist': artist_name,
                #         'id': artist_id,
                #         'uri': artist_uri,
                #         'generic_genre': genre,
                #         'genres': artist_info['genres'],
                #         'popularity': recommendation["tracks"][w]["popularity"]
                #     })
                # for feat in artist_info['genres'][0:4]:
                #     g.add_node(feat, genre=feat, color=colors[i][:-1])
                #     g.add_edge(genre, feat)
                #     generic_top_genre = get_generic_top_genre(feat)
                #     if (generic_top_genre != None):
                #         g.add_edge(generic_top_genre, feat)
                #
                #
                #

                new_rec = sp.recommendations(seed_artists=[artist_uri], limit=45)
                for x in range(0, len(new_rec["tracks"])):
                    artist_name = new_rec["tracks"][x]["artists"][0]["name"]
                    artist_id = new_rec["tracks"][x]["artists"][0]["id"]
                    artist_uri = new_rec["tracks"][x]["artists"][0]["uri"]
                    artist_info = sp.artist(artist_uri)
                    # if (len(artist_info['genres']) > 0):
                        # artists[genre].append({
                        #     'artist': artist_name,
                        #     'id': artist_id,
                        #     'uri': artist_uri,
                        #     'generic_genre': genre,
                        #     'genres': artist_info['genres'],
                        #     'popularity': new_rec["tracks"][x]["popularity"]
                        # })
                    for feat2 in artist_info['genres'][0:4]:
                        g.add_node(feat2, genre=feat2, color=colors[i][:-1])
                        g.add_edge(genre, feat2)
                        generic_top_genre = get_generic_top_genre(feat2)
                        if (generic_top_genre != None):
                            g.add_edge(generic_top_genre, feat2)
        except:
            print("Error for ", artist_name)
            continue

    if(save_as != None):
        nx.write_gpickle(g, path=save_as)

    return g


def load_word_vectors(wv=None, path=None):
    if(path != None):
        wv = KeyedVectors.load(path, mmap='r')
    if(path == None and wv == None):
        raise Exception("Pass Either a WV or Path")
    user = User("screamywill")
    top_artists = user.get_top_artists(limit=100)
    ranges = ["short_term", "medium_term", "long_term"]
    user_genres = []
    genre_mappings = {"short_term":{}, "medium_term":{}, "long_term":{}}
    sorted_mappings = {"short_term": {}, "medium_term": {}, "long_term": {}}

    for range in ranges:
        for artist in top_artists[range]:
            # user_genres.append(artist["genres"][0])
            user_genres += artist["genres"]

            for user_genre in artist["genres"]:
                # user_genre = artist["genres"][0]
                for genre in top_genres:
                    try:
                        similarity = wv.similarity(user_genre, genre)
                        # if(genre == "jazz" or genre == "country"):
                        if(genre in genre_mappings[range]):
                            genre_mappings[range][genre] += similarity
                        else:
                            genre_mappings[range][genre] = similarity
                    except:
                        continue

        print(genre_mappings)
        sorted_mappings[range] = sorted(genre_mappings[range].items(), key=(lambda x: x[1]), reverse=True)
        total = float(sum(genre_mappings[range].values()))
        print(range.upper())
        for genre in sorted_mappings[range]:
            print(genre, float(genre[1])/total)#, int(genre[1]),int(minimum))


def create_word_vectors(g,dimensions=2,save_as=None, load_from_path=None):
    walks = n2v.Node2Vec(g, dimensions=dimensions, num_walks=150, walk_length=4)
    model = walks.fit(min_count=1, workers=8)
    wv = model.wv
    if(save_as != None):
        model.wv.save(save_as)

    if(load_from_path != None):
        wv = KeyedVectors.load(load_from_path, mmap='r')

    return wv


# try playing around with dimensions for fixing similarity
# g = nx.read_gpickle(path="final_country.pickle")
# add_nodes_for_genre("", g, save_as="final_country.pickle")

# wv = create_word_vectors(g, dimensions=3)#, save_as="new_kv_80dim.kv")
# new_g = add_nodes_for_genre("country", g, save_as="final_country.pickle")
# draw_graph(g, wv, three_dim=False, save=False, load_from_path=None)
load_word_vectors(path="model_kv.kv")









def draw_graph(g, wv, three_dim=False, save=False, load_from_path=None):
    x = []
    y = []
    z = []
    colors = []
    genres = []
    labels = []
    popularities = []

    # for edge in g.edges:
    #     if(edge[0] in all_genres):
    #         print(edge[0],edge[1])
    #     elif(edge[1] in all_genres):
    #         print(edge[1],edge[0])

    dimensions = 2 if not three_dim else 80

    for i, node in enumerate(g.nodes(data=True)):
        if ("genre" in node[1] and (node[1]["genre"] in top_genres)):
            vec = wv.get_vector(node[0])
            x.append(vec[0])
            y.append(vec[1])
            if (three_dim):
                z.append(vec[2])
            genre = node[1]["genre"]
            colors.append(node[1]["color"])
            labels.append(node[1]["genre"])
            popularities.append(node[1]["popularity"])

            # print(genre, wv.most_similar(genre))
            # print()
            # print()

    if (not three_dim):
        node_trace = go.Scatter(x=x, y=y,
                                mode='markers',
                                hoverinfo='text',
                                hovertext=labels,
                                marker=dict(
                                    showscale=True,
                                    # colorscale options
                                    # 'Greys' | 'YlGnBu' | 'Greens' | 'YlOrRd' | 'Bluered' | 'RdBu' |
                                    # 'Reds' | 'Blues' | 'Picnic' | 'Rainbow' | 'Portland' | 'Jet' |
                                    # 'Hot' | 'Blackbody' | 'Earth' | 'Electric' | 'Viridis' |
                                    colorscale='YlGnBu',
                                    reversescale=True,
                                    color=colors,
                                    # [random.randint(0, 255),random.randint(0, 255),random.randint(0, 255)],
                                    size=popularities,
                                    colorbar=dict(
                                        thickness=15,
                                        title='Node Connections',
                                        xanchor='left',
                                        titleside='right'
                                    ),
                                    line_width=2))

    else:
        node_trace = go.Scatter3d(x=x, y=y, z=z,
                                  mode='markers',
                                  hoverinfo='text',
                                  hovertext=labels,
                                  marker=dict(
                                      showscale=True,
                                      # colorscale options
                                      # 'Greys' | 'YlGnBu' | 'Greens' | 'YlOrRd' | 'Bluered' | 'RdBu' |
                                      # 'Reds' | 'Blues' | 'Picnic' | 'Rainbow' | 'Portland' | 'Jet' |
                                      # 'Hot' | 'Blackbody' | 'Earth' | 'Electric' | 'Viridis' |
                                      colorscale='YlGnBu',
                                      reversescale=True,
                                      color=colors,
                                      # [random.randint(0, 255),random.randint(0, 255),random.randint(0, 255)],
                                      size=popularities,
                                      colorbar=dict(
                                          thickness=15,
                                          title='Node Connections',
                                          xanchor='left',
                                          titleside='right'
                                      ),
                                      line_width=2))

    fig = go.Figure(data=[node_trace], layout=go.Layout(
        title='<br>Network graph made with Python',
        titlefont_size=16,
        showlegend=False,
        hovermode='closest',
        margin=dict(b=20, l=5, r=5, t=40),
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
                    )
    fig.show()


