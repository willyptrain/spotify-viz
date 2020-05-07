import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd
import json
import matplotlib.pyplot as plt
import numpy as np
import math
import random


token = spotipy.util.prompt_for_user_token('fignick', 'streaming', client_id='eb173f7af2f14a189be9011019c90df2', client_secret='859a9fd7c02d42dbaa60519163071386', redirect_uri='http://localhost')


sp = spotipy.Spotify(auth=token)

class Track:

    def __init__(self, name, url, by_artist, genres=[]):
        self.url = url
        self.name = name
        self.artist = by_artist
        self.genres = genres

    def __str__(self):
        return "%s; %s; %s; %s" \
               % (self.name,self.artist,self.genres,self.url)




class Lookup:

    def __init__(self):
        self.artist_info = {}
        self.artists = {}

    def add_artist(self,artist):
        self.artist_info[artist] = {}
        self.artists.append(artist)

    def get_artist_tags(self, arg_name, tags=None):
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

    def get_artist(self, artist):
        get = sp.search(q='artist:'+artist, type='artist')
        return get

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

    def get_genres(self, artist):
        artist = sp.search(q=artist, type='artist')["artists"]["items"][0]
        return artist['genres']

    def get_recommendations(self, artist, k=10):
        artist_search = sp.search(q=artist,type='artist')["artists"]["items"][0]
        results = sp.recommendations(seed_artists=[artist_search['id']], limit=k)

        tracks = []

        for track in results['tracks']:
            if(track['artists'][0]['name'].lower() != artist.lower()):
                genres = self.get_genres(track['artists'][0]['name'])
                temp = Track(name=track['name'], url=track["uri"],by_artist=track['artists'][0]['name'], genres=genres)
                tracks.append(temp)

        return tracks















arts = Lookup()
arts.get_recommendations("darwin deez", 10)




#
# artists = ["childish gambino","alt-J","darwin deez","phoenix", "two door cinema club", "vampire weekend", "cage the elephant", "drake", "still woozy",
#            "Cosmo Pyke", "Linkin Park", "Jay-Z", "Peach Pit", "Animal Collective", "Jimmy Hendrix", "John Mayer",
#            "tobi lou", "mac miller", "flume", "rex orange county", "louis the child",
#            "frank ocean", "clairo", "broken bells", "giraffage", "odesza", "chet faker",
#            "steve lacy", "sampha","healy","felly","j.cole","modest mouse","xxxtentacion",
#            "mounika","childish gambino","alt-J"]
#
#













