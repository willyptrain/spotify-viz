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

print(len(all_genres))

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





def draw_graph(g, three_dim=False, save=False, load_from_path=None):
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
    if(save == True):
        walks = n2v.Node2Vec(g, dimensions=dimensions, num_walks=80, walk_length=6)
        model = walks.fit(min_count=1, workers=8)
        wv = model.wv
        model.wv.save("model_kv.kv")

    # model = model.load('model.model')
    if(load_from_path != None):
        wv = KeyedVectors.load(load_from_path, mmap='r')

    for i, node in enumerate(g.nodes(data=True)):
        if("genre" in node[1] and (node[1]["genre"] in top_genres)):
            vec = wv.get_vector(node[0])
            x.append(vec[0])
            y.append(vec[1])
            if(three_dim):
                z.append(vec[2])
            genre = node[1]["genre"]
            colors.append(node[1]["color"])
            labels.append(node[1]["genre"])
            popularities.append(node[1]["popularity"])



            # print(genre, wv.most_similar(genre))
            # print()
            # print()


    if(not three_dim):
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

    

# construct_graph(save=True, path="final.pickle")

# g = nx.read_gpickle(path="final.pickle")
# draw_graph(g, three_dim=False, save=False, load_from_path=None)

def load_word_vectors(path):
    wv = KeyedVectors.load(path, mmap='r')
    user = User("screamywill")
    top_artists = user.get_top_artists()
    range = "short_term"
    user_genres = []
    genre_mappings = {}

    for artist in top_artists[range]:
        # user_genres.append(artist["genres"][0])
        user_genres += artist["genres"]

    for user_genre in user_genres:
        # user_genre = artist["genres"][0]
        for genre in top_genres:
            try:
                similarity = wv.similarity(user_genre, genre)
                # if(genre == "country"):
                    # print(artist["name"], user_genre, genre, similarity)
                if(genre in genre_mappings):
                    genre_mappings[genre] += similarity
                else:
                    genre_mappings[genre] = similarity
            except:
                continue

    sorted_mappings = sorted(genre_mappings.items(), key=(lambda x: x[1]), reverse=True)
    print(sorted_mappings)
    minimum = sorted_mappings[-1][1]
    for genre in sorted_mappings:
        print(genre)#, int(genre[1]),int(minimum))








load_word_vectors("model_kv.kv")












