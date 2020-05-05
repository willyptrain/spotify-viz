import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import json
import networkx as nx
import matplotlib.pyplot as plt
import random
import plotly.graph_objs as go



class music_graph:

    def __init__(self, artists=[], k=5):
        self.artists = artists
        self.neighborhood_size = k
        self.sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())
        self.G = nx.Graph()
        self.positions = {}
        self.neighborhood_nodes = {}
        self.edges = {"x":[],"y":[],"z":[]}

    def add_artist(self, artist):
        if(type(artist) == str):
            self.artists.append(artist)

    def construct_neighborhood(self, artist):
        get = self.sp.search(q=artist, limit=self.neighborhood_size)
        self.G.add_node(artist)
        sum_of_features = {"danceability":0.0, "energy":0.0, "instrumentalness":0.0}
        for track in get["tracks"]["items"]:
            self.neighborhood_nodes[artist] = track["name"]
            features = self.sp.audio_features(track["uri"])[0]
            sum_of_features["danceability"] += features["danceability"]
            sum_of_features["energy"] += features["energy"]
            sum_of_features["instrumentalness"] += features["instrumentalness"]
            self.positions[track["name"]] = [
                features["danceability"], features["energy"], features["instrumentalness"]
            ]
            # print(artist,track["name"])
            self.G.add_edge(artist,track["name"])

        self.positions[artist] = [
            sum_of_features["danceability"]/self.neighborhood_size,
            sum_of_features["energy"]/self.neighborhood_size,
            sum_of_features["instrumentalness"]/self.neighborhood_size,
        ]




    def draw_neighborhood(self, artist):
        if(artist not in self.positions):
            raise Exception("Need data for artist: " + str(artist))
        else:
            x0 = self.positions[artist][0]
            y0 = self.positions[artist][1]
            z0 = self.positions[artist][2]

            for edge in self.G.edges():
                x1 = self.positions[edge[1]][0]
                y1 = self.positions[edge[1]][1]
                z1 = self.positions[edge[1]][2]
                self.edges["x"].append(x0)
                self.edges["x"].append(x1)
                self.edges["y"].append(y0)
                self.edges["y"].append(y1)
                self.edges["z"].append(z0)
                self.edges["z"].append(z1)

            edge_trace = go.Scatter3d(x=self.edges["x"],y=self.edges["y"],
                                      z=self.edges["z"], line=dict(width=0.5, color='#888'))

            node_x = []
            node_y = []
            node_z = []
            for node in self.G.nodes():
                node_x.append(self.positions[node][0])
                node_y.append(self.positions[node][1])
                node_z.append(self.positions[node][2])

            node_trace = go.Scatter3d(
                x=node_x, y=node_y,z=node_z,
                mode='markers',
                hoverinfo='text',
                marker=dict(
                    showscale=True,
                    # colorscale options
                    #'Greys' | 'YlGnBu' | 'Greens' | 'YlOrRd' | 'Bluered' | 'RdBu' |
                    #'Reds' | 'Blues' | 'Picnic' | 'Rainbow' | 'Portland' | 'Jet' |
                    #'Hot' | 'Blackbody' | 'Earth' | 'Electric' | 'Viridis' |
                    colorscale='YlGnBu',
                    reversescale=True,
                    color=[random.randint(0, 255),random.randint(0, 255),random.randint(0, 255)],
                    size=10,
                    colorbar=dict(
                        thickness=15,
                        title='Node Connections',
                        xanchor='left',
                        titleside='right'
                    ),
                    line_width=2))


            fig = go.Figure(data=[edge_trace, node_trace],layout=go.Layout(
                            title='<br>Network graph made with Python',
                            titlefont_size=16,
                            showlegend=False,
                            hovermode='closest',
                            margin=dict(b=20,l=5,r=5,t=40),

                            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
            )
            fig.show()

    def draw_neighborhoods(self, artists):
        colors = []
        song_library = []
        for artist in artists:
            color = random.randint(0, 255)
            for k in range(0, self.neighborhood_size):
                colors.append(color)
            if (artist not in self.positions):
                w.construct_neighborhood(artist)

            x0 = self.positions[artist][0]
            y0 = self.positions[artist][1]
            z0 = self.positions[artist][2]

            for edge in self.G.edges():
                if(edge[0] == artist):
                    x1 = self.positions[edge[1]][0]
                    y1 = self.positions[edge[1]][1]
                    z1 = self.positions[edge[1]][2]
                    self.edges["x"].append(x0)
                    self.edges["x"].append(x1)
                    self.edges["y"].append(y0)
                    self.edges["y"].append(y1)
                    self.edges["z"].append(z0)
                    self.edges["z"].append(z1)
            edge_trace = go.Scatter3d(x=self.edges["x"], y=self.edges["y"],
                                    z=self.edges["z"],
                                      line=dict(width=1, color='#888'),
                                      hoverinfo='none')


            node_x = []
            node_y = []
            node_z = []
            for node in self.G.nodes():
                song_library.append(node)
                node_x.append(self.positions[node][0])
                node_y.append(self.positions[node][1])
                node_z.append(self.positions[node][2])


        node_trace = go.Scatter3d(
            x=node_x, y=node_y, z=node_z,
            mode='markers',
            hovertext=song_library,
            hoverinfo='text',
             marker=dict(
                showscale=True,
                # colorscale options
                # 'Greys' | 'YlGnBu' | 'Greens' | 'YlOrRd' | 'Bluered' | 'RdBu' |
                # 'Reds' | 'Blues' | 'Picnic' | 'Rainbow' | 'Portland' | 'Jet' |
                # 'Hot' | 'Blackbody' | 'Earth' | 'Electric' | 'Viridis' |
                colorscale='Portland',
                reversescale=True,
                color=colors,
                size=10,
                colorbar=dict(
                    thickness=15,
                    title='Node Connections',
                    xanchor='left',
                    titleside='right'
                ),
            line_width=2))

        fig = go.Figure(data=[edge_trace, node_trace], layout=go.Layout(
            title='<br>Artist and Features in 3d Space',
            titlefont_size=16,
            showlegend=False,
            hovermode='closest',
            margin=dict(b=20, l=5, r=5, t=40),
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)
            )
        )
        fig.show()


w = music_graph(["childish gambino","alt-J","darwin deez"])
           #      , "two door cinema club", "vampire weekend", "cage the elephant", "drake", "still woozy",
           # "Cosmo Pyke", "Linkin Park", "Jay-Z", "Peach Pit", "Animal Collective", "Jimmy Hendrix", "John Mayer",
           # "tobi lou", "mac miller", "flume", "rex orange county", "louis the child",
           # "frank ocean", "clairo", "broken bells", "giraffage", "odesza", "chet faker",
           # "steve lacy", "sampha","healy","felly","j.cole","modest mouse","xxxtentacion",
           # "mounika","childish gambino","alt-J"])
# w.construct_neighborhood(w.artists[0])
# w.construct_neighborhood(w.artists[1])
w.draw_neighborhoods(w.artists)

