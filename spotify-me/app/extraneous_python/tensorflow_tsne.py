
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
import node2vec as n2v


color_list = """
            darkred, darkseagreen,
            darkslateblue, moccasin, navajowhite, navy,
            oldlace, olive, olivedrab, orange, orangered,
            orchid, palegoldenrod, palegreen, paleturquoise,
            palevioletred, papayawhip, peachpuff, peru, pink,
            plum, powderblue, purple, red, rosybrown,
            royalblue, rebeccapurple, saddlebrown, salmon,
            sandybrown, seagreen, seashell, sienna, silver,
            skyblue, slateblue, slategray, slategrey, snow,
            springgreen, steelblue, tan, teal, thistle, tomato,
            turquoise, violet, wheat, white, whitesmoke,
            yellow, yellowgreen
""".split()


class tsne:

    def train_model(self, g):
        walks = n2v.Node2Vec(g, dimensions=3, walk_length=16, num_walks=100)
        model = walks.fit(window=10, min_count=1)
        return model

    def draw_predicted_graph(self, model, g):
        x = []
        y = []
        z = []
        colors = []
        genres = []
        labels = []
        for node in g.nodes(data=True):
            x.append(model.wv.get_vector(node[0])[0])
            y.append(model.wv.get_vector(node[0])[1])
            z.append(model.wv.get_vector(node[0])[2])
            if("artist" in node[1] and node[1]["artist"]):
                if ("genre" in node[1] and node[1]["genre"]):
                    labels.append(node[1]["genre"])
                else:
                    labels.append(node[1]["artist"])

            if ("genre" in node[1] and node[1]["genre"]):
                genre = node[1]["genre"]
                if (genre in genres):
                    colors.append(color_list[genres.index(genre)][:-1])
                else:
                    genres.append(genre)
                    colors.append(color_list[genres.index(genre)][:-1])
            elif ("features" in node[1] and "details" in node[1]):
                genre = node[1]["details"]["generic genre"]
                track_artist = node[1]["details"]['artist']
                track_name = node[1]["details"]['track_names']
                labels.append("%s" % (genre))
                if (genre in genres):
                    colors.append(color_list[genres.index(genre)][:-1])
                else:
                    genres.append(genre)
                    colors.append(color_list[genres.index(genre)][:-1])


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
                                      size=10,
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

        # print(walks)
        # for node, _ in model.most_similar('Bandit (with YoungBoy Never Broke Again)'):
        #     print(node)
