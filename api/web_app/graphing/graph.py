import networkx as nx
import matplotlib.pyplot as plt
from .music import Lookup, Track
#import music
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
from numpy import linalg
import random
import plotly.graph_objs as go
import pandas as pd
from . import spotify_graph
from . import tensorflow_tsne
import math
import chart_studio
import chart_studio.plotly as py

token = spotipy.util.prompt_for_user_token('fignick','streaming',client_id='eb173f7af2f14a189be9011019c90df2',client_secret='859a9fd7c02d42dbaa60519163071386',redirect_uri='http://localhost')

username = 'spotifyviz' # your username
api_key = 'yfr5j4bQayShQ4LaCbva' # your api key - go to profile > settings > regenerate key
chart_studio.tools.set_credentials_file(username=username, api_key=api_key)


class Graph:
    def __init__(self):
        self.G = nx.Graph()
        self.lookup = Lookup()
        self.all_artist_nodes = []
        self.sp = spotipy.Spotify(auth=token)
        self.tracks_by_artist = {}
        self.artist_graphs = {}
        self.albums_by_artist = {}
        self.artist_album_graphs = {}
        self.album_graphs = {}
        self.albums = {}
        self.tracks = {}


    # gets user saved songs
    def get_saved_tracks(self, limit=50):
        return self.sp.current_user_saved_tracks(limit=limit)['items']

    def construct_neighborhood(self, artist, media='tracks', k=15):
        if media == 'tracks':
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
        elif media == 'track_list':
            if artist in self.tracks_by_artist.keys():
                if(track["name"] not in self.tracks_by_artist[artist]):
                    g = self.track_graphs[artist]
                    g.add_node(artist, genres=self.lookup.get_genres(artist))
                    self.tracks_by_artist[artist].append(track["name"])
                    features = self.sp.audio_features(track["uri"])[0]
                    g.add_node(track["name"], features=features)
                    g.add_edge(artist, track["name"])
                    self.track_graphs[artist] = g
                    return g
                else:
                    return self.track_graphs[artist]
            else:
                    g = nx.Graph()
                    g.add_node(artist, genres=self.lookup.get_genres(artist))
                    self.tracks_by_artist[artist] = [track["name"]]
                    features = self.sp.audio_features(track["uri"])[0]
                    g.add_node(track["name"], features=features)
                    g.add_edge(artist, track["name"])
                    self.track_graphs[artist] = g
                    return g


        elif media == 'albums':
            if(artist not in self.artist_graphs):
                get = self.sp.search(q=artist, type='artist', limit=k)
                artist_id = get['artists']['items'][0]['id']
                self.albums_by_artist[artist] = self.sp.artist_albums(artist_id, limit=10)
                g = nx.Graph()
                g.add_node(artist, genres=self.lookup.get_genres(artist))
                for album in self.albums_by_artist[artist]['items']:
                    g.add_node(album['name'], id=album['id'])
                    album_id = album['id']
                    for track in self.sp.album_tracks(album_id)['items']:
                        if track == 'href':
                            continue
                        else:
                            features = self.sp.audio_features(track["uri"])[0]
                            g.add_node(track["name"], features=features)
                            g.add_edge(artist, track["name"])
                    

                self.artist_album_graphs[artist] = g
                return g
            else:
                return self.artist_album_graphs[artist]
        else:
            return "Invalid type parameter."

    # input album, construct neighborhood for album
    def construct_album_neighborhood(self, album, k=5):
        if(album not in self.album_graphs):
                get = self.sp.search(q=album, type='album', limit=k)
                album_id = get['albums']['items'][0]['id']
                album_name = get['albums']['items'][0]['name']
                #print(album_name, album_id, get)
                self.albums[album] = self.sp.albums([album_id])
                g = nx.Graph()
                g.add_node(album, id=album_id)
                for track in self.sp.album_tracks(album_id)['items']:
                        if track == 'href':
                            continue
                        else:
                            features = self.sp.audio_features(track["uri"])[0]
                            g.add_node(track["name"], features=features)
                            g.add_edge(album, track["name"])

                self.album_graphs[album] = g
                return g
        else:
            return self.album_graphs[album]



    def construct_music_graph(self, artists):
        g = nx.Graph()
        for artist in artists:
            if(artist not in self.artist_graphs):
                artist_tracks = self.construct_neighborhood(artist, media='track_list')
                self.G.add_nodes_from(artist_tracks.nodes(data=True))
                self.G.add_edges_from(artist_tracks.edges(data=True))
            recommendations = self.lookup.get_recommendations(artist)
            for track in recommendations:
                self.all_artist_nodes.append(track.artist)
                new_g = self.construct_neighborhood(track.artist, media='tracks')
                self.G.add_nodes_from(new_g.nodes(data=True))
                self.G.add_edges_from(new_g.edges(data=True))
                self.G.add_edge(artist, track.artist)
    
    # constructs graph for set of a tracks / saved songs
    def construct_track_graph(self, tracks):
        for track in tracks:
            #print(track[0])
            if(track['track']['id'] not in self.tracks):
                artist = track['track']['artists'][0]['name']
                new_track = self.construct_neighborhood(artist, media='tracks')
                self.G.add_nodes_from(new_track.nodes(data=True))
                self.G.add_edges_from(new_track.edges(data=True))
            
    

    # input list of artists or list of albums, graph the albums
    def construct_album_graph(self, artists=None, albums=None):
        if artists:
            for artist in artists:
                if(artist not in self.artist_graphs):
                    artist_tracks = self.construct_neighborhood(artist, media='albums')
                    self.G.add_nodes_from(artist_tracks.nodes(data=True))
                    self.G.add_edges_from(artist_tracks.edges(data=True))
        elif albums:
            for album in albums:
                if(album not in self.album_graphs):
                    album = self.construct_album_neighborhood(album)
                    self.G.add_nodes_from(album.nodes(data=True))
                    self.G.add_edges_from(album.edges(data=True))
        else:
            return 0

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
                    colors[node[1]["genres"][0]] = f'rgb({np.random.randint(0,256)}, {np.random.randint(0,256)}, {np.random.randint(0,256)})'  # "rgb(%s,%s,%s)" % (random.randint(0,255),random.randint(0,255),random.randint(0,255))
                    curr_color = colors[curr_genre]
                    # color_scatter.append(curr_color)
            
            if ("genres" not in node[1] and "id" in node[1]):
                #print("yo")
                found_id = False
                for i in range(0, len(node[1]["id"])):
                    if (node[1]["id"][i] in colors):
                        curr_id = node[1]["id"]
                        curr_color = colors[curr_id]
                        print(curr_id)
                        found_id = True
                        break
                        # color_scatter.append(curr_color)
                if(not found_id and len(node[1]["id"]) > 0):
                    curr_id = node[1]["id"]
                    colors[node[1]["id"]] = f'rgb({np.random.randint(0,256)}, {np.random.randint(0,256)}, {np.random.randint(0,256)})' 
                    curr_color = colors[curr_id]
                    # color_scatter.append(curr_color)
            # track
            if("features" in node[1]):
                
                if(node[1]["features"]):
                    #print(np.array(list(node[1]["features"].values())[0:11]))
                    #print("color", curr_color)
                    features.append(np.array(list(node[1]["features"].values())[0:11]))
                    color_scatter.append(curr_color)
                    node_color[node[0]] = curr_color
        u, s, v = linalg.svd(features)
        return u, color_scatter            


    def singular_value_decomp_svd(self,g):


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
                    colors[node[1]["genres"][0]] = f'rgb({np.random.randint(0,256)}, {np.random.randint(0,256)}, {np.random.randint(0,256)})'  # "rgb(%s,%s,%s)" % (random.randint(0,255),random.randint(0,255),random.randint(0,255))
                    curr_color = colors[curr_genre]
                    # color_scatter.append(curr_color)
            
            if ("genres" not in node[1] and "id" in node[1]):
                #print("yo")
                found_id = False
                for i in range(0, len(node[1]["id"])):
                    if (node[1]["id"][i] in colors):
                        curr_id = node[1]["id"]
                        curr_color = colors[curr_id]
                        print(curr_id)
                        found_id = True
                        break
                        # color_scatter.append(curr_color)
                if(not found_id and len(node[1]["id"]) > 0):
                    curr_id = node[1]["id"]
                    colors[node[1]["id"]] = f'rgb({np.random.randint(0,256)}, {np.random.randint(0,256)}, {np.random.randint(0,256)})' 
                    curr_color = colors[curr_id]
                    # color_scatter.append(curr_color)

            # track
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

        u, colors = self.singular_value_decomp_svd(g)
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

    def read_csv(self, file, index_beg=None, index_end=None):
        if(not index_beg and not index_beg):
            df = pd.read_csv(file)
            return df.sort_values(by="recommended_by")
        else:
            if(str(type(index_beg)) == "<class 'int'>"):
                if(str(type(index_end)) == "<class 'int'>"):
                    df = pd.read_csv(file)
                    return df.iloc[index_beg:index_end]
                else:
                    df = pd.read_csv(file)
                    return df.iloc[index_beg:]
            else:
                if (str(type(index_end)) == "<class 'int'>"):
                    df = pd.read_csv(file)
                    return df.iloc[:index_end]
                else:
                    if (str(type(index_beg)) == "<class 'float'>"):
                        if (str(type(index_end)) == "<class 'float'>"):
                            df = pd.read_csv(file)
                            rows = len(df.index)
                            beg = math.floor(index_beg*rows)
                            end = math.floor(index_end*rows)
                            return df.iloc[beg:end]
                        else:
                            df = pd.read_csv(file)
                            rows = len(df.index)
                            beg = math.floor(index_beg * rows)
                            return df.iloc[beg:]
                    else:
                        if (str(type(index_end)) == "<class 'float'>"):
                            df = pd.read_csv(file)
                            rows = len(df.index)
                            end = math.floor(index_end * rows)
                            return df.iloc[:end]
                        else:
                            raise Exception("Indices must be an integer or float")



    def draw_graph(self):
        u, colors = self.singular_value_decomp()
        #print(colors)
        x = u[:,0]
        y = u[:,1]
        z = u[:,2]
        size = u[:,3]
        new_size = (size - min(size)) / (max(size) - min(size))
        marker_size = np.round(14 * new_size)
        print(len(marker_size))
        print(len(x))
        node_trace = go.Scatter3d(x=x, y=y, z=z,mode='markers',
                                  marker=dict(size=marker_size,colorscale='Earth',color=colors), hovertext=list(self.G.nodes()), hoverinfo='text')
        curr_artist = ""
        # x0 = 0
        # y0 = 0
        # z0 = 0
        # edge_x = []
        # edge_y = []
        # edge_z = []
        #
        # index = 0
        # for i, edge in enumerate(self.G.edges()):
        #     if(edge[0] != curr_artist):
        #         curr_artist = edge[0]
        #         x0 = x[index]
        #         y0 = y[index]
        #         z0 = z[index]
        #     else:
        #         edge_x.append(x0)
        #         edge_x.append(x[index])
        #         edge_y.append(y0)
        #         edge_y.append(y[index])
        #         edge_z.append(z0)
        #         edge_z.append(z[index])
        #         index += 1
        # edge_trace = go.Scatter3d(x=edge_x, y=edge_y,
        #                           z=edge_z, line=dict(width=0.5, color='#888'))
        fig = go.Figure(data=[node_trace], layout=go.Layout(
            title='<br>Network graph made with Python', paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
            titlefont_size=16,
            showlegend=False,
            hovermode='closest',
            margin=dict(b=20, l=5, r=5, t=40),
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
                        )
        return py.plot(fig, filename="new", auto_open=False)


    def create_graph_from_df(self, df):
        # df = self.read_csv(csv, index_begin, index_end)
        g = nx.Graph()
        subgraphs = {}

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
                g.add_nodes_from(subgraphs[artist].nodes(data=True))
                g.add_edges_from(subgraphs[artist].edges(data=True))
            else:
                features = self.get_features(row_dict, True)
                details = self.get_track_details(row_dict)
                subgraphs[artist].add_node(row_dict["track_names"], features=features, details=details)
                subgraphs[artist].add_edge(artist, row_dict["track_names"])
                g.add_nodes_from(subgraphs[artist].nodes(data=True))
                g.add_edges_from(subgraphs[artist].edges(data=True))

            if(recommender in g.nodes()):
                g.add_edge(recommender,artist)


        # mg = music_graph()
        # mg.draw_graph(g)
        return g



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

'''
file = 'data/recommendations_k50.csv'
g = Graph()
tf = tsne()

training_df = g.read_csv(file, 0,0.75)#g.create_graph_from_csv('data/recommendations_k10.csv')
testing_df = g.read_csv(file, 0.75, None)#g.create_graph_from_csv('data/recommendations_k10.csv')

training_graph = g.create_graph_from_df(training_df)
testing_graph = g.create_graph_from_df(testing_df)

model = tf.train_model(training_graph)
tf.draw_predicted_graph(model, testing_graph)

'''
#g = Graph()
# g.construct_neighborhood("drake")
'''
g.construct_music_graph(["ludwig van beethoven","slipknot"])
g.draw_graph()
'''

# yo check these two functions out
#g.construct_album_graph(albums=["Rubber Soul", "Beautiful Thugger Girls", "Finally Rich"])
#my_saved_songs = g.get_saved_tracks()
#print(my_saved_songs[0]['track']['artists'][0]['name'])
#g.construct_track_graph(my_saved_songs)


#link = g.draw_graph()
#print(link)

# next: use 3d value decomp to use as position in 3d graph construction, essentially just add nodes


