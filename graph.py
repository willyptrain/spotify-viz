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
        self.sp = spotipy.Spotify(client_credentials_manager=SpotifyCredentials())
        self.tracks_by_artist = {}
        self.artist_graphs = {}
        self.albums_by_artist = {}
        self.artist_album_graphs = {}


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


    def construct_music_graph(self, artists):
        for artist in artists:
            if(artist not in self.artist_graphs):
                artist_tracks = self.construct_neighborhood(artist, media='tracks')
                self.G.add_nodes_from(artist_tracks.nodes(data=True))
                self.G.add_edges_from(artist_tracks.edges(data=True))
            recommendations = self.lookup.get_recommendations(artist)
            for track in recommendations:
                self.all_artist_nodes.append(track.artist)
                new_g = self.construct_neighborhood(track.artist, media='tracks')
                self.G.add_nodes_from(new_g.nodes(data=True))
                self.G.add_edges_from(new_g.edges(data=True))
                self.G.add_edge(artist, track.artist)
    

    # input 1 artist, graph their albums
    def construct_album_graph(self, artists):
        for artist in artists:
            if(artist not in self.artist_graphs):
                artist_tracks = self.construct_neighborhood(artist, media='albums')
                self.G.add_nodes_from(artist_tracks.nodes(data=True))
                self.G.add_edges_from(artist_tracks.edges(data=True))
            


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
            title='<br>Network graph made with Python',
            titlefont_size=16,
            showlegend=False,
            hovermode='closest',
            margin=dict(b=20, l=5, r=5, t=40),

            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
                        )
        fig.show()




g = Graph()
# g.construct_neighborhood("drake")
'''
g.construct_music_graph(["ludwig van beethoven","slipknot"])
g.draw_graph()
'''

g.construct_album_graph(["kanye west"])
g.draw_graph()

# next: use 3d value decomp to use as position in 3d graph construction, essentially just add nodes


