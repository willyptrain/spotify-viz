import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd
import json
import matplotlib.pyplot as plt
import numpy as np
import math
import random


sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())


class artist_lookup:

    def __init__(self):
        self.artist_info = {}
        self.artists = {}

    def add_artist(self,artist):
        self.artist_info[artist] = {}
        self.artists.append(artist)

    def get_artist_tags(self, arg_name="darwin deez", tags=None):
        if tags is None:
            tags = ["genres", "popularity"]
        search = sp.search(q='artist:' + arg_name, type='artist')
        info = {"artist":arg_name, "content":{}}
        if(len(search['artists']['items']) > 0):
            artist = search['artists']['items'][0]
            for tag in tags:
                if(tag in artist):
                    if(isinstance(artist[tag], list) and len(artist[tag]) != 0):
                        info["content"][tag] = artist[tag]
                    if(not isinstance(artist[tag],list)):
                        info["content"][tag] = artist[tag]
        return info

    def get_artists_tags(self, artists=[], tags=None):
        data = []
        index = 0
        if tags is None:
            tags = ["genres", "popularity"]
        for artist in artists:
            data.append({})
            data[index].update({'artist':artist})
            data[index].update(self.get_artist_tags(artist)["content"])
            index += 1
        return pd.DataFrame.from_dict(data)
        # return data

    def get_top_k_tracks(self, artist=None, k=10):
        if(artist == None):
            return []
        results = sp.search(q=artist, limit=k)
        return results#json.dumps(results, indent=4)

    def get_top_k_track_info(self, artist, k=10):
        danceability = []
        energy = []
        key = []
        loudness = []
        mode = []
        speechiness = []
        acousticness = []
        instrumentalness = []
        liveness = []
        valence = []
        tempo = []
        tracks = []
        results = self.get_top_k_tracks(artist, k)
        for k,v in enumerate(results["tracks"]["items"]):
            tracks.append(v["uri"])

        features = sp.audio_features(tracks)
        for feature in features:
            if(feature):
                danceability.append(feature["danceability"])
                energy.append(feature["energy"])
                key.append(feature["key"])
                loudness.append(feature["loudness"])
                mode.append(feature["mode"])
                speechiness.append(feature["speechiness"])
                acousticness.append(feature["acousticness"])
                instrumentalness.append(feature["instrumentalness"])
                liveness.append(feature["liveness"])
                valence.append(feature["valence"])
                tempo.append(feature["tempo"])

        together = {
            "danceability": danceability,
            "energy": energy,
            "key": key,
            "loudness": loudness,
            "mode": mode,
            "speechiness": speechiness,
            "acousticness": acousticness,
            "instrumentalness": instrumentalness,
            "liveness": liveness,
            "valence": valence,
            "tempo": tempo
        }

        self.artist_info[artist] = together
        return together

    def get_95_interval(self, data):
        mean = np.mean(np.array(data))
        sum = 0.0
        for x in data:
            sum += (x-mean)**2

        st_dev = sqrt(sum/(len(data)-1))
        return [data-(2*st_dev),data+(2*st_dev)]









arts = artist_lookup()


artists = ["childish gambino","alt-J","darwin deez","phoenix", "two door cinema club", "vampire weekend", "cage the elephant", "drake", "still woozy",
           "Cosmo Pyke", "Linkin Park", "Jay-Z", "Peach Pit", "Animal Collective", "Jimmy Hendrix", "John Mayer",
           "tobi lou", "mac miller", "flume", "rex orange county", "louis the child",
           "frank ocean", "clairo", "broken bells", "giraffage", "odesza", "chet faker",
           "steve lacy", "sampha","healy","felly","j.cole","modest mouse","xxxtentacion",
           "mounika","childish gambino","alt-J"]



loudness = []

for i in range(0, len(artists)):
    arts.get_top_k_track_info(artists[i])
    loudness.append(arts.artist_info[artists[i]]["loudness"])




# fig, axs = plt.subplots(5, 6)

x = []
y = []
colors = []

fig, ax = plt.subplots()
ax = fig.add_subplot(111)

for i in range(0, len(loudness)):
    x.append(i)
    y.append(np.mean(loudness[i]))
    colors.append(random.randint(0,255))


ax.scatter(x,y,s=[2*math.pi*(i)**2 for i in y], c=colors)
for i in range(0, len(y)):
    ax.annotate(artists[i],(x[i],y[i]))
plt.show()

#use n = 10 samples/tracks to estimate population/true artist characteristic (i.e. danceability)
#use confidence interval





















