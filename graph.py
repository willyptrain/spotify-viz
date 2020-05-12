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
        g = nx.Graph()
        for artist in artists:
            if(artist not in self.artist_graphs):
                artist_tracks = self.construct_neighborhood(artist)
                g.add_nodes_from(artist_tracks.nodes(data=True))
                g.add_edges_from(artist_tracks.edges(data=True))
            recommendations = self.lookup.get_recommendations(artist)
            for track in recommendations:
                self.all_artist_nodes.append(track.artist)
                new_g = self.construct_neighborhood(track.artist)
                g.add_nodes_from(new_g.nodes(data=True))
                g.add_edges_from(new_g.edges(data=True))
                g.add_edge(artist, track.artist)
        return g


    def singular_value_decomp(self,g):


        features = []
        colors = {}
        color_scatter = []
        curr_color = ""
        node_color = {}

        for node in g.nodes(data=True):
            # print(node)
            print(node)
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
                if(node[1]["features"]):
                    key = list(node[1]["features"].keys())[0]
                    features.append(np.array([v for k,v in node[1]["features"][key].items()]))
                    color_scatter.append(curr_color)
                    node_color[node[0]] = curr_color

        # print(features)

        u, s, v = linalg.svd(features, full_matrices=False)

        return u, color_scatter

    def draw_graph_with_svd(self,g):

        u, colors = self.singular_value_decomp(g)
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

    def read_csv(self, file):
        df = pd.read_csv(file)
        return df.sort_values(by="recommended_by")






    def create_graph_from_csv(self, csv):
        df = self.read_csv(csv)

        g = nx.Graph()



        # print({k: g for k,g in df.groupby("track_names")})
        # for k,v in df.groupby("track_names"):
        #     # print(df.loc(k))
        #     features = v.iloc[0].to_dict()
        #     artist = features['artist']
        #     track = features['track_names']
        #     feature_dict[artist] = {
        #         track : {
        #             'features':[],
        #             'track_details':[]
        #         }
        #     }
        #     feature_dict[artist][track]['features'] = self.get_features(features)
        #     feature_dict[artist][track]['track_details'] = self.get_track_details(features)



        subgraphs = {}
        pos = {}

        for index, row in df.iterrows():
            artist = row['artist']
            recommender = row['recommended_by']
            row_dict = row.to_dict()
            if(artist not in subgraphs):
                subgraphs[artist] = nx.Graph()
                subgraphs[artist].add_node(row_dict["track_names"])
                features = self.get_features(row_dict, True)
                details = self.get_track_details(row_dict)
                subgraphs[artist].add_node(row_dict["track_names"], features=features, details=details)
                subgraphs[artist].add_node(artist, artist=row_dict["artist"], genre=row_dict["generic genre"])
                subgraphs[artist].add_edge(artist, row_dict["track_names"])

                # randX = random.randint(0,250000)
                # randY = random.randint(0,250000)
                # pos[artist] = (randX,randY)
                # pos[row_dict["track_names"]] = (randX + ((-1)**(random.randint(1,3)))*random.randint(1,10),
                #                                 randY + ((-1)**(random.randint(1,3)))*random.randint(1,10))

                g.add_nodes_from(subgraphs[artist].nodes(data=True))
                g.add_edges_from(subgraphs[artist].edges(data=True))
            else:
                features = self.get_features(row_dict, True)
                details = self.get_track_details(row_dict)
                subgraphs[artist].add_node(row_dict["track_names"], features=features, details=details)
                subgraphs[artist].add_edge(artist, row_dict["track_names"])
                g.add_nodes_from(subgraphs[artist].nodes(data=True))
                g.add_edges_from(subgraphs[artist].edges(data=True))

                # pos[row_dict["track_names"]] = (pos[artist][0] + ((-1) ** (random.randint(1, 3))) * random.randint(1, 10),
                #                                 pos[artist][1] + ((-1) ** (random.randint(1, 3))) * random.randint(1, 10))

            if(recommender in g.nodes()):
                g.add_edge(recommender,artist)


        mg = music_graph()
        mg.draw_graph(g)



    def get_features(self, features, no_tag=False):
        if(not no_tag):
            tags = ["danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo"]
            feature_dict = {}
            for key in tags:
                feature_dict[key] = features[key]
            return feature_dict
        else:
            feature_list = []
            tags = ["danceability", "energy", "key", "loudness", "mode", "speechiness", "acousticness",
                    "instrumentalness", "liveness", "valence", "tempo"]
            for key in tags:
                feature_list.append(features[key])
            return feature_list

    def get_track_details(self, features):
        tags = ["track_names", "artist", "generic genre", "genre", "color", "recommended_by", "track_num"]
        feature_dict = {}
        for key in tags:
            feature_dict[key] = features[key]
        return feature_dict

# g = Graph()
# # g.construct_neighborhood("drake")
# g.construct_music_graph(["ludwig van beethoven","slipknot"])
# g.draw_graph()
g = Graph()
g.create_graph_from_csv('data/recommendations_k10.csv')




# next: use 3d value decomp to use as position in 3d graph construction, essentially just add nodes


