import networkx as nx
import matplotlib.pyplot as plt
from music import Lookup, Track
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np

class Graph:
    def __init__(self):
        self.G = nx.Graph()
        self.lookup = Lookup()
        self.all_artist_nodes = []
        self.sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())
        self.tracks_by_artist = {}
        self.artist_graphs = {}


    def construct_neighborhood(self, artist, k=5):
        if(artist not in self.artist_graphs):
            get = self.sp.search(q=artist, limit=k)
            g = nx.Graph()
            g.add_node(artist)
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
                self.G.add_nodes_from(artist_tracks)
                self.G.add_edges_from(artist_tracks.edges)
            recommendations = self.lookup.get_recommendations(artist)
            for track in recommendations:
                self.all_artist_nodes.append(track.artist)
                new_g = self.construct_neighborhood(track.artist)
                self.G.add_nodes_from(new_g)
                self.G.add_edges_from(new_g.edges)
                self.G.add_edge(artist, track.artist)

    def draw_g(self):
        print(self.G.nodes())
        print(self.G.edges())
        nx.draw(self.G)
        plt.show()
        # change to plotly




g = Graph()
# g.construct_neighborhood("drake")
g.construct_music_graph(["clairo"])
g.draw_g()


