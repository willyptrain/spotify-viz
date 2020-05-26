# from sklearn.manifold import TSNE
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






client_credentials_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

item = items()

all_genres = item.get_genres()

k = 100
artists = {}
features_by_genre = {}
g = nx.Graph()
colors = item.get_colors()
split = len(colors)
all_genres = all_genres[0:split]
select_genres = item.select_genres()[0:split]

# avg_popularity = {}

# for i, genre in enumerate(all_genres):
#     print(i)
#     g.add_node(genre, genre=genre, color=colors[i][:-1])
#     recommendation = sp.recommendations(seed_genres=[genre], limit=k)
#     artists[genre] = []
#     avg_popularity[genre] = 0
#     for w in range(0, len(recommendation["tracks"])):
#         artist_name = recommendation["tracks"][w]["artists"][0]["name"]
#         artist_id = recommendation["tracks"][w]["artists"][0]["id"]
#         artist_uri = recommendation["tracks"][w]["artists"][0]["uri"]
#         artist_info = sp.artist(artist_uri)
#         if(len(artist_info['genres']) > 0):
#             artists[genre].append({
#                 'artist':artist_name,
#                 'id': artist_id,
#                 'uri': artist_uri,
#                 'generic_genre':genre,
#                 'genres':artist_info['genres'],
#                 'popularity':recommendation["tracks"][w]["popularity"]
#             })
#         for feat in artist_info['genres']:
#             g.add_node(feat, genre=feat, color=colors[i][:-1])
#             g.add_edge(genre, feat)
#         avg_popularity[genre] += recommendation["tracks"][w]["popularity"]
#     avg_popularity[genre] = avg_popularity[genre]/len(recommendation["tracks"]) 
#     g.nodes[genre]['popularity'] = avg_popularity[genre]


# nx.write_gpickle(g, path="graph.pickle")




def draw_graph(g, three_dim=False):
    x = []
    y = []
    z = []
    colors = []
    genres = []
    labels = []
    popularities = []

    dimensions = 2 if not three_dim else 3

    walks = n2v.Node2Vec(g, dimensions=dimensions, num_walks=80, walk_length=10)
    model = walks.fit(min_count=1, workers=8)   

    for i, node in enumerate(g.nodes(data=True)):
        if("genre" in node[1] and (node[1]["genre"] in select_genres)):
            vec = model.wv.get_vector(node[0])
            x.append(vec[0])
            y.append(vec[1])
            if(three_dim):
                z.append(vec[2])
            genre = node[1]["genre"]
            colors.append(node[1]["color"])
            labels.append(node[1]["genre"])
            popularities.append(node[1]["popularity"])


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



g = nx.read_gpickle(path="graph.pickle")

for edge in g.edges:
    if(edge[0] in all_genres):
        print(edge[0],edge[1])
    elif(edge[1] in all_genres):
        print(edge[1],edge[0])



draw_graph(g, three_dim=False)
    
