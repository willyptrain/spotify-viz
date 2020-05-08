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


class Graph:
    def __init__(self):
        self.G = nx.Graph()
        self.lookup = Lookup()
        self.all_artist_nodes = []
        self.sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())
        self.tracks_by_artist = {}
        self.artist_graphs = {}


    def construct_neighborhood(self, artist, k=15):
        if(artist not in self.artist_graphs):
            get = self.sp.search(q=artist, limit=k)
            g = nx.Graph()
            g.add_node(artist, genres=self.lookup.get_genres(artist))
            self.tracks_by_artist[artist] = []
            for track in get["tracks"]["items"]:
                self.tracks_by_artist[artist].append(track["name"])
                features = self.sp.audio_features(track["uri"])[0]
                g.add_node(track["name"], features=features)
                g.add_edge(artist, track["name"])

            self.artist_graphs[artist] = g
            return g
        else:
            return self.artist_graphs[artist]


    def construct_music_graph(self, artists):
        for artist in artists:
            if(artist not in self.artist_graphs):
                artist_tracks = self.construct_neighborhood(artist)
                self.G.add_nodes_from(artist_tracks.nodes(data=True))
                self.G.add_edges_from(artist_tracks.edges(data=True))
            recommendations = self.lookup.get_recommendations(artist)
            for track in recommendations:
                self.all_artist_nodes.append(track.artist)
                new_g = self.construct_neighborhood(track.artist)
                self.G.add_nodes_from(new_g.nodes(data=True))
                self.G.add_edges_from(new_g.edges(data=True))
                self.G.add_edge(artist, track.artist)


    def singular_value_decomp(self):


        features = []
        colors = {}
        color_scatter = []
        curr_color = ""
        node_color = {}

        for node in self.G.nodes(data=True):
            if ("genres" in node[1]):
                found_genre = False
                for i in range(0, len(node[1]["genres"])):
                    if (node[1]["genres"][i] in colors):
                        curr_genre = node[1]["genres"][i]
                        curr_color = colors[curr_genre]
                        found_genre = True
                        break
                        # color_scatter.append(curr_color)
                if(not found_genre and len(node[1]["genres"]) > 0):
                    curr_genre = node[1]["genres"][0]
                    colors[node[1]["genres"][0]] = random.randint(0,255)  # "rgb(%s,%s,%s)" % (random.randint(0,255),random.randint(0,255),random.randint(0,255))
                    curr_color = colors[curr_genre]
                    # color_scatter.append(curr_color)
            if("features" in node[1]):
                # print(node[0], list(node[1]["features"]))
                if(node[1]["features"]):
                    features.append(np.array(list(node[1]["features"].values())[0:11]))
                    color_scatter.append(curr_color)
                    node_color[node[0]] = curr_color


        u, s, v = linalg.svd(features)

        return u, color_scatter

    def draw_graph(self):

        u, colors = self.singular_value_decomp()
        x = u[:,0]
        y = u[:,1]
        z = u[:,2]
        size = u[:,3]

        new_size = (size - min(size)) / (max(size) - min(size))
        marker_size = np.round(14 * new_size)

        node_trace = go.Scatter3d(x=x, y=y, z=z,mode='markers',
                                  marker=dict(size=marker_size,colorscale='Earth',color=colors), hovertext=list(self.G.nodes()), hoverinfo='text')

        fig = go.Figure(data=[node_trace], layout=go.Layout(
            title='<br>Network graph made with Python',
            titlefont_size=16,
            showlegend=False,
            hovermode='closest',
            margin=dict(b=20, l=5, r=5, t=40),
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)))
        fig.show()

    

g = Graph()
# g.construct_neighborhood("drake")
g.construct_music_graph(["ludwig van beethoven","slipknot"])
g.draw_graph()
# next: use 3d value decomp to use as position in 3d graph construction, essentially just add nodes


