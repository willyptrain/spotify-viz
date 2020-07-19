import React, { useState, useEffect, Component, setState } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import {BrowserView, MobileView} from 'react-device-detect';
import Carousel from 'react-material-ui-carousel'
import 'react-multi-carousel/lib/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Doughnut, Radar } from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import ItemsCarousel from 'react-items-carousel';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import Icon from '@material-ui/core/Icon';
import { Grommet, Distribution, Box, Text, grommet } from 'grommet';
import ArtistPage from '../top_artists/ArtistPage.js';
import RelatedTracks from '../top_tracks/RelatedTracks.js';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import AudioPlayer from 'material-ui-audio-player';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ScrollIntoView from 'react-scroll-into-view';
import GenreChart from '../dashboard/GenreChart.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';


export function ScrollGenres(data) {

    const all_genres = ['acoustic', 'neo mellow', 'pop', 'pop rock', 'singer-songwriter', 'viral pop', 'channel pop', 'indie cafe pop', 'post-teen pop', 'folk-pop', 'modern rock', 'stomp and holler', 'alternative rock', 'grunge', 'permanent wave', 'post-grunge', 'piano rock', 'bossa nova cover', 'coverchill', 'uk pop', 'acoustic pop', 'utah indie', 'modern alternative rock', 'rock', 'indie folk', 'indiecoustica', 'anti-folk', 'classic swedish pop', 'swedish alternative rock', 'swedish pop', 'swedish singer-songwriter', 'dance pop', 'electropop', 'metropopolis', 'neo-singer-songwriter', 'british singer-songwriter', 'chamber pop', 'neo soul', 'r&b', 'urban contemporary', 'british soul', 'eau claire indie', 'melancholia', 'gothenburg indie', 'soft rock', 'beatlesque', 'britpop', 'madchester', 'lds youth', 'indie anthem-folk', 'canadian pop', 'celtic rock', 'adult standards', 'contemporary vocal jazz', 'lounge', 'soul', 'australian pop', 'ann arbor indie', 'michigan folk', 'michigan indie', 'indie pop', 'jacksonville indie', 'jam band', 'modern folk rock', 'boy band', 'art pop', 'europop', 'alternative metal', 'swedish americana', 'vocal jazz', 'uk americana', 'chamber psych', 'folktronica', 'canadian folk', 'canadian indie', 'new americana', 'downtempo', 'electronica', 'ninja', 'nu jazz', 'edm', 'pop rap', 'auckland indie', 'etherpop', 'indie electropop', 'shimmer pop', 'canadian singer-songwriter', 'deep new americana', 'classic rock', 'folk', 'folk rock', 'fingerstyle', 'british folk', 'swedish idol pop', 'lilith', 'irish singer-songwriter', 'afrobeat', 'afropop', 'kwaito', 'kwaito house', 'south african jazz', 'ethio-jazz', 'funk', 'malian blues', 'mande pop', 'world', 'afro dancehall', 'azontobeats', 'bongo flava', 'mbira', 'south african pop', 'sungura', 'azonto', 'rumba congolaise', 'soukous', 'detroit hip hop', 'hip hop', 'rap', 'griot', 'desert blues', 'makossa', 'broadway', 'disney', 'hollywood', 'movie tunes', 'mellow gold', 'latin', 'latin hip hop', 'puerto rican pop', 'reggaeton', 'nigerian hip hop', 'nigerian pop', 'album rock', 'francoton', 'french pop', 'ghanaian hip hop', 'jazz trumpet', 'african gospel', 'reggae fusion', 'kora', 'highlife', 'mbalax', 'zouglou', 'ugandan pop', 'african reggae', 'south african choral', 'guinean pop', 'mallet', 'alt-rock', 'alternative pop', 'dream pop', 'canadian metal', 'canadian rock', 'nu metal', 'boston rock', 'funk metal', 'funk rock', 'german alternative rock', 'emo', 'blues rock', 'dayton indie', 'halifax indie', 'indie rock', 'rock quebecois', 'gbvfi', 'jangle pop', 'power pop', 'lo-fi', 'post-punk', 'scottish indie', 'modern power pop', 'hard rock', 'comedy rock', 'comic', 'comic metal', 'rock drums', 'no wave', 'palm desert scene', 'stoner rock', 'art punk', 'art rock', 'dance rock', 'dance-punk', 'experimental rock', 'acoustic punk', 'punk', 'slow core', 'garage rock', 'brooklyn indie', 'e6fi', 'freak folk', 'indie punk', 'glam metal', 'alabama indie', 'modern blues rock', 'knoxville indie', 'math rock', 'cowpunk', 'athens indie', 'denver indie', 'alternative country', 'chicago indie', 'candy pop', 'noise pop', 'experimental', 'alternative', 'indietronica', 'alternative dance', 'baroque pop', 'brighton indie', 'la indie', 'australian indie', 'indie poptimism', 'rap metal', 'austindie', 'denton tx indie', 'uk alternative pop', 'irish rock', 'philly indie', 'pop punk', 'baltimore indie', 'chillwave', 'nz pop', 'new romantic', 'new wave', 'oxford indie', 'experimental pop', 'french shoegaze', 'neo-synthpop', 'shiver pop', 'alternative hip hop', 'british indie rock', 'ambient', 'intelligent dance music', 'compositional ambient', 'abstract', 'drift', 'american post-rock', 'cinematic post-rock', 'instrumental post-rock', 'braindance', 'focus', 'post-rock', 'ambient folk', 'ambient trance', 'psychill', 'space ambient', 'jazztronica', 'ambient house', 'minimal techno', 'american contemporary classical', 'danish alternative rock', 'danish indie', 'bow pop', 'ethereal wave', 'ambient worship', 'icelandic indie', 'big beat', 'trip hop', 'danish electronic', 'danish electropop', 'australian shoegaze', 'german electronica', 'neo-classical', 'ambient idm', 'dark jazz', 'livetronica', 'drone', 'canadian experimental', 'bass music', 'alternative americana', 'ambient psychill', 'dutch indie', 'drill and bass', 'boston indie', 'indie dream pop', 'icelandic classical', 'indie psych-pop', 'nu age', 'anime', 'anime cv', 'j-division', 'j-pop girl group', 'otacore', 'denpa-kei', 'idol rock', 'anime rock', 'j-idol', 'j-pop', 'j-poprock', 'j-rap', 'j-rock', 'vocaloid', 'japanese emo', 'visual kei', 'japanese singer-songwriter', 'japanese alternative rock', 'anime score', 'j-metal', 'j-indie', 'anime latino', 'j-dance', 'japanese city pop', 'enka', 'kayokyoku', 'japanese electropop', 'techno kayo', 'j-pixie', 'black-metal', 'black metal', 'death metal', 'groove metal', 'melodic death metal', 'dark black metal', 'metal', 'norwegian black metal', "black 'n' roll", 'blackened crust', 'ambient black metal', 'atmospheric black metal', 'autonomous black metal', 'black thrash', 'depressive black metal', 'swedish black metal', 'norwegian metal', 'british black metal', 'gothic metal', 'blackgaze', 'gothenburg metal', 'melodic black metal', 'folk black metal', 'folk metal', 'bluegrass', 'appalachian folk', 'bluegrass gospel', 'old-time', 'modern old-time', 'instrumental bluegrass', 'clean comedy', 'comedy', 'progressive bluegrass', 'neo-traditional bluegrass', 'country gospel', 'duluth indie', 'banjo', 'north carolina indie', 'jamgrass', 'mandolin', 'jug band', 'country', 'country rock', 'manitoba indie', 'family gospel', 'southern gospel', 'blues', 'chicago blues', 'electric blues', 'acid rock', 'modern blues', 'acoustic blues', 'boogie-woogie', 'louisiana blues', 'jazz blues', 'soul blues', 'harmonica blues', 'delta blues', 'rhythm and blues', 'british blues', 'country blues', 'traditional blues', 'soul jazz', 'british invasion', 'bossanova', 'bossa nova', 'sambass', 'forro', 'mpb', 'samba', 'baile pop', 'brazilian boogie', 'bossa nova jazz', 'brazilian composition', 'brazilian jazz', 'choro', 'velha guarda', 'jazz guitar', 'italian jazz fusion', 'fado', 'brazilian indie', 'latin classical', 'brazil', 'brazilian rock', 'rock gaucho', 'rock nacional brasileiro', 'pop nacional', 'nova mpb', 'rock alternativo brasileiro', 'latin alternative', 'mangue bit', 'funk carioca', 'funk das antigas', 'pagode baiano', 'brazilian punk', 'umbanda', 'sertanejo universitario', 'sertanejo', 'sertanejo pop', 'pagode', 'afrobeat brasileiro', 'brazilian hip hop', 'latin afrobeat', 'samba-rock', 'hard rock brasileiro', 'brazilian soul', 'brazilian psychedelic', 'brasilia indie', 'brazilian reggae', 'partido alto', 'folk brasileiro', 'brazilian emo', 'brazilian hardcore', 'breakbeat', 'rare groove', 'hardcore techno', 'rave', 'nu skool breaks', 'instrumental soul', 'classic progressive house', 'progressive house', 'progressive trance house', 'bboy', 'instrumental funk', 'liquid funk', 'drum and bass', 'drumfunk', 'stateside dnb', 'bristol electronic', 'jungle', 'ragga jungle', 'deep liquid bass', 'swiss hip hop', 'norwegian hip hop', 'disco house', 'complextro', 'electro house', 'hammond organ', 'jazz funk', 'jazz organ', 'deep dnb', 'minimal dnb', 'soundtrack', 'gabba', 'happy hardcore', 'bahamian pop', 'neurofunk', 'glitch hop', 'uk dnb', 'darkstep', 'jump up', 'brill building pop', 'bubblegum pop', 'northern soul', 'southern soul', 'disco', 'motown', 'post-disco', 'turntablism', 'cyberpunk', 'digital hardcore', 'german techno', 'rap rock', 'underground rap', 'jazz fusion', 'modern funk', 'go-go', 'hip house', 'deep dubstep', 'electronic trap', 'vapor twitch', 'jazz piano', 'smooth jazz', 'dutch trance', 'progressive trance', 'quiet storm', 'minimal tech house', 'british', 'girl group', 'new rave', 'glam rock', 'liverpool indie', 'mod revival', 'new wave pop', 'cantopop', 'c-pop', 'classic cantopop', 'hong kong rock', 'hong kong hip hop', 'chinese indie', 'hong kong indie', 'vintage chinese pop', 'mandopop', 'classic french pop', 'chinese audiophile', 'chinese jazz', 'classic mandopop', 'chinese indie rock', 'singaporean mandopop', 'chicago-house', 'acid house', 'chicago house', 'techno', 'deep house', 'deep soul house', 'broken beat', 'deep disco house', 'float house', 'footwork', 'atmospheric dnb', 'detroit techno', 'electro jazz', 'chicago rap', 'detroit house', 'minneapolis sound', 'house', 'vocal house', 'electro', 'harlem hip hop', 'minimal dub', 'tech house', 'deep groove house', 'classic soul', 'speed garage', 'children', 'canadian soundtrack', 'show tunes', "children's music", 'kindie rock', "australian children's music", 'neon pop punk', 'big room', 'miami hip hop', 'barbadian pop', 'social media pop', 'cartoon', 'nursery', 'geek rock', 'zolo', 'australian dance', 'australian electropop', "children's choir", 'australian hip hop', 'hip pop', 'contemporary country', 'country pop', 'country road', 'doo-wop', 'sunshine pop', 'latin viral pop', 'rap latina', 'chill', 'deep tropical house', 'new french touch', 'indie r&b', 'dutch hip hop', 'tropical house', 'bmore', 'reggae', 'new orleans rap', 'g funk', 'gangster rap', 'canadian contemporary r&b', 'reggae rock', 'uk dance', 'nu gaze', 'german pop', 'israeli pop', 'irish pop', 'french soundtrack', 'ska mexicano', 'ska punk', 'classical', 'avant-garde', 'contemporary classical', 'german soundtrack', 'classical harp', 'acousmatic', 'early modern classical', 'late romantic era', 'british modern classical', 'post-romantic era', 'canadian classical', 'middle earth', 'scorecore', 'classic soundtrack', 'italian soundtrack', 'vintage italian soundtrack', 'baroque', 'early music', 'italian baroque', 'american modern classical', 'early romantic era', 'polish classical', 'classical era', 'norwegian classical', 'harpsichord', 'italian opera', 'post-minimalism', 'german baroque', 'russian modern classical', 'french opera', 'operetta', 'impressionism', '21st century classical', 'american 21st century classical', 'classical performance', 'opera', 'orchestra', 'victorian britain', 'violin', 'neoclassicism', 'austro-german modernism', 'baltic classical', 'icelandic pop', 'finnish classical', 'british contemporary classical', 'british soundtrack', 'classical piano', 'turkish jazz', 'russian romanticism', 'tin pan alley', 'club', 'filter house', 'bitpop', 'deep big room', 'escape room', 'grime', 'diva house', 'eurodance', 'brostep', 'catstep', 'bass trap', 'dubstep', 'deep euro house', 'belgian pop', 'german dance', 'trance', 'moombahton', 'future garage', 'austrian pop', 'microhouse', 'electro latino', 'latin pop', 'dutch edm', 'destroy techno', 'balearic', 'dutch house', 'bubblegum dance', 'canadian electronic', 'uk funky', 'comedy', 'comedienne', 'deep comedy', 'latino comedy', 'new comedy', 'british comedy', 'black comedy', 'canadian comedy', 'haitian gospel', 'country', 'modern country rock', 'country dawn', 'arkansas country', 'outlaw country', 'oklahoma country', 'heartland rock', 'australian country', 'roots rock', 'alberta country', 'canadian contemporary country', 'canadian country', 'redneck', 'pop emo', 'modern southern rock', 'texas country', 'bakersfield sound', 'country rap', 'dance', 'afrofuturism', 'asian american hip hop', 'aussietronica', 'indie soul', 'swedish electropop', 'electra', 'gauze pop', 'uplifting trance', 'bass house', 'fidget house', 'belgian edm', 'australian house', 'zapstep', 'pop edm', 'street punk', 'nu disco', 'progressive uplifting trance', 'dancehall', 'lovers rock', 'modern reggae', 'roots reggae', 'jawaiian', 'soca', 'danish hip hop', 'panamanian pop', 'chutney', 'conscious hip hop', 'danish pop', 'swedish dancehall', 'swedish reggae', 'old school dancehall', 'riddim', 'funana', 'deep ragga', 'dub', 'rap kreyol', 'basshall', 'tropical', 'death-metal', 'brutal death metal', 'deathgrind', 'florida death metal', 'birmingham metal', 'crossover thrash', "death 'n' roll", 'melodic groove metal', 'finnish death metal', 'finnish metal', 'melodic metalcore', 'buffalo ny metal', 'swedish death metal', 'swedish metal', 'italian death metal', 'symphonic death metal', 'german death metal', 'jazz metal', 'polish death metal', 'djent', 'deep-house', 'hamburg electronic', 'melodic techno', 'brazilian edm', 'italian tech house', 'irish electronic', 'french indie pop', 'french rock', 'swedish electronic', 'swedish techno', 'lithuanian electronic', 'deep techno', 'latin tech house', 'pop house', 'german house', 'groove room', 'leipzig electronic', 'canadian house', 'deep melodic euro house', 'dub techno', 'house argentino', 'dark techno', 'deep minimal techno', 'funky tech house', 'detroit-techno', 'french techno', 'tribal house', 'proto-techno', 'dark disco', 'acid trance', 'dusseldorf electronic', 'ambient techno', 'scottish techno', 'dutch tech house', 'electroclash', 'taiwan pop', 'disco', 'philly soul', 'k-pop', 'k-rap', 'hi-nrg', 'brit funk', 'east coast hip hop', 'italian disco', 'c86', 'dunedin indie', 'dunedin sound', 'romanian pop', 'chicago soul', 'progressive electro house', 'classic uk pop', 'disney', 'tagalog worship', 'classic canadian rock', 'celtic', 'scottish folk', 'cowboy western', 'rock-and-roll', 'rockabilly', 'brazilian modern jazz', 'new jack swing', 'drum-and-bass', 'finnish edm', 'chillstep', 'gaming edm', 'bassline', 'deep liquid', 'afro house', 'belgian rock', 'substep', 'uk alternative hip hop', 'slovak electronic', 'dub', 'filthstep', 'future rock', 'dubstep product', 'uk hip hop', 'industrial metal', 'glitch', 'dubstep', 'jazz boom bap', 'deathstep', 'nz electronic', 'instrumental grime', 'london rap', 'edm', 'dakke dak', 'chiptune', 'future funk', 'indie game soundtrack', 'jamtronica', 'screamo', 'trancecore', 'future house', 'pop violin', 'nordic house', 'indie jazz', 'purple sound', 'scottish electronic', 'scottish hip hop', 'deep uplifting trance', 'electro swing', 'classic hardstyle', 'electro trash', 'psychedelic trance', 'deep pop edm', 'nintendocore', 'swedish synth', 'electro', 'belgian dance', 'electronic', 'wonky', 'indie garage rock', 'comedy rap', 'vaporwave', 'canadian electropop', 'edmonton indie', 'danish indie pop', 'german rock', 'icelandic electronic', 'electronic rock', 'emo', 'alternative emo', 'dreamo', 'metalcore', 'pixie', 'post-hardcore', 'midwest emo', 'socal pop punk', 'uk metalcore', 'canadian pop punk', 'canadian punk', 'christian metal', 'dc hardcore', 'emo punk', 'emocore', 'canadian post-hardcore', 'folk', 'australian indie folk', 'rhode island indie', 'swedish country', 'albuquerque indie', 'french indietronica', 'austin americana', 'forro', 'brazilian percussion', 'forro tradicional', 'accordion', 'baiao', 'pernambuco alternative', 'axe', 'brega', 'vaqueiro', 'carimbo', 'tecnobrega', 'french', 'chanson', 'torch song', 'vintage schlager', 'belgian singer-songwriter', 'french hip hop', 'pop urbaine', 'variete francaise', 'nouvelle chanson francaise', 'french jazz', 'cabaret', 'vintage hollywood', 'chanson paillarde', 'french folk pop', 'colombian pop', 'ye ye', 'rap conscient', 'french reggae', 'rock alternatif francais', 'funk', 'danish jazz', 'deep funk', 'portland hip hop', 'brass band', 'p funk', 'psychedelic rock', 'new orleans funk', 'acid jazz', 'garage', 'uk garage', 'australian garage punk', 'bay area indie', 'gothabilly', 'classic garage rock', 'freakbeat', 'uk dancehall', 'atl hip hop', 'deep pop r&b', 'garage rock revival', 'punk blues', 'garage pop', 'neo-psychedelic', 'german hip hop', 'old school thrash', 'glam punk', 'action rock', 'swedish garage rock', 'protopunk', 'trash rock', 'tucson indie', 'birmingham hip hop', 'atlanta indie', 'german', 'german alternative rap', 'partyschlager', 'schlager', 'german pop rock', 'persian pop', 'german indie', 'classic schlager', 'christlicher rap', 'deep german hip hop', 'german cloud rap', 'liedermacher', 'neue deutsche welle', 'hamburg hip hop', 'german indie rock', 'turkish hip hop', 'german metal', 'neue deutsche harte', 'german singer-songwriter', 'eurovision', 'german reggae', 'alpine yodeling', 'discofox', 'austropop', 'neue volksmusik', 'uk contemporary r&b', 'kolsche karneval', 'german indie pop', 'gospel', 'praise', 'gospel r&b', 'contemporary gospel', 'naija worship', 'anthem worship', 'ccm', 'christian alternative rock', 'christian music', 'world worship', 'christian hip hop', 'goth', 'finnish power metal', 'gothic symphonic metal', 'dark wave', 'gothic rock', 'dutch metal', 'power metal', 'corrosion', 'finnish hard rock', 'opera metal', 'italian gothic', 'italian gothic metal', 'italian metal', 'cyber metal', 'industrial rock', 'deathrock', 'industrial', 'norwegian doom metal', 'symphonic metal', 'slayer', 'neue deutsche todeskunst', 'finnish alternative rock', 'grindcore', 'mathcore', 'crust punk', 'noisecore', 'goregrind', 'powerviolence', 'boston hardcore', 'chaotic hardcore', 'belgian metal', 'groove', 'synthpop', 'memphis soul', 'piano blues', 'freestyle', 'relaxative', 'classic girl group', 'grunge', 'south african rock', 'guitar', 'progressive metal', 'speed metal', 'instrumental rock', 'metal guitar', 'neo classical metal', 'instrumental surf', 'mexican classic rock', 'chicago hardcore', 'chicago punk', 'hardcore punk', 'australian psych', 'progressive rock', 'noise rock', 'happy', 'ectofolk', 'scottish rock', 'swedish indie pop', 'british alternative rock', 'dirty south rap', 'hard-rock', 'nwobhm', 'early us punk', 'german hard rock', 'swedish power metal', 'dutch prog', 'dutch rock', 'hardcore', 'canadian hardcore', 'melodic hardcore', 'swedish hardcore', 'skate punk', 'connecticut hardcore', 'nyhc', 'boston punk', 'straight edge', 'horror punk', 'new jersey hardcore', 'new jersey punk', 'chicano punk', 'ska', 'd-beat', 'hardstyle', 'euphoric hardstyle', 'rawstyle', 'nederlandse hardstyle', 'melbourne bounce international', 'tekk', 'uptempo hardcore', 'sound effects', 'heavy-metal', 'viking metal', 'boston metal', 'progressive jazz fusion', 'melodic thrash', 'melodic metal', 'suomi rock', 'deathcore', 'melodic deathcore', 'doom metal', 'drone metal', 'post-doom metal', 'deathrash', 'thall', 'australian metalcore', 'miami metal', 'progressive metalcore', 'greek metal', 'german metalcore', 'prog metal', 'hip-hop', 'hardcore hip hop', 'indie pop rap', 'deep underground hip hop', 'melodic rap', 'west coast rap', 'dfw rap', 'old school hip hop', 'channel islands indie', 'vapor soul', 'bronx hip hop', 'canadian hip hop', 'atl trap', 'nc hip hop', 'alternative r&b', 'philly rap', 'southern hip hop', 'trap', 'baton rouge rap', 'pittsburgh rap', 'dmv rap', 'crunk', 'emo rap', 'florida rap', 'new jersey rap', 'holidays', 'deep adult standards', 'easy listening', 'space age pop', 'big band', 'swing', 'bebop', 'cool jazz', 'jazz', 'ballroom', 'vocal harmony group', 'american folk revival', 'exotica', 'laboratorio', 'jazz saxophone', 'christmas instrumental', 'jazz trio', 'a cappella', 'jazz trombone', 'motivation', 'dixieland', 'calypso', 'honky-tonk', 'nashville sound', 'traditional folk', 'honky tonk', 'dansband', 'danspunk', 'traditional country', 'classic country pop', 'house', 'la pop', 'vocal trance', 'idm', 'deep idm', 'breakcore', 'ambient pop', 'indie electronica', 'indian', 'desi pop', 'filmi', 'modern bollywood', 'sufi', 'afghan pop', 'hindi hip hop', 'classic pakistani pop', 'punjabi pop', 'indian folk', 'bhangra', 'desi hip hop', 'college a cappella', 'deep indian pop', 'pakistani pop', 'tamil hip hop', 'tamil pop', 'classic bollywood', 'ghazal', 'indie', 'anthem emo', 'british post-rock', 'cosmic post-rock', 'christchurch indie', 'bedroom pop', 'montreal indie', 'quebec indie', 'milwaukee hip hop', 'english indie rock', 'stomp pop', 'el paso indie', 'shoegaze', 'norwegian pop', 'indie-pop', 'industrial', 'ebm', 'electro-industrial', 'aggrotech', 'early synthpop', 'dark electro', 'futurepop', 'belgian new wave', 'british industrial', 'vintage french electronic', 'iranian', 'azeri traditional', 'classic persian pop', 'persian traditional', 'persian alternative', 'tar', 'arab folk', 'duduk', 'armenian pop', 'j-dance', 'andean', 'shibuya-kei', 'k-pop boy group', 'japanese jazztronica', 'j-reggae', 'japanese r&b', 'japanese techno', 'japanese experimental', 'japanese electronic', 'j-pop boy group', 'k-pop girl group', 'classic j-rock', 'j-ambient', 'japanese idm', 'circuit', 'avant-garde jazz', 'contemporary post-bop', 'japanese jazz fusion', 'j-idol', 'alt-idol', 'heavy alternative', 'kawaii metal', 'j-pop', 'eurobeat', 'j-acoustic', 'japanese metalcore', 'japanese jazz', 'japanese punk rock', 'japanese instrumental', 'j-rock', 'japanese ska', 'japanese post-hardcore', 'japanese soul', 'japanese rockabilly', 'japanese post-rock', 'japanese shoegaze', 'oshare kei', 'j-punk', 'japanese pop punk', 'japanese dream pop', 'japanese new wave', 'japanese garage rock', 'japanese math rock', 'japanese indie pop', 'japanese indie rock', 'jazz', 'hard bop', 'jazz cubano', 'latin jazz', 'classical trumpet', 'contemporary jazz', 'ecm-style jazz', 'modern jazz piano', 'electric bass', 'dutch jazz', 'free jazz', 'jazz brass', 'free improvisation', 'new orleans jazz', 'jazz violin', 'polish jazz', 'gypsy jazz', 'boogaloo', 'salsa', 'salsa international', 'k-pop', 'korean r&b', 'korean pop', 'korean jazz', 'new age piano', 'k-indie', 'k-rock', 'trot', 'kids', "children's folk", 'nueva cancion', "canadian children's music", "preschool children's music", 'language', 'musiikkia lapsille', 'lullaby', 'vbs', 'latin', 'reggaeton flow', 'spanish pop', 'banda', 'regional mexican', 'cantautor', 'nova canco', 'grupera', 'mariachi', 'ranchera', 'trap argentino', 'norteno', 'regional mexican pop', 'mexican pop', 'cumbia', 'salsa colombiana', 'perreo', 'trap latino', 'classic italian pop', 'italian pop', 'argentine indie', 'argentine rock', 'latin rock', 'latin arena pop', 'flamenco', 'flamenco guitar', 'rumba', 'zouk', 'bachata', 'champeta', 'cancion melodica', 'trap espanol', 'bolero', 'mexican rock', 'rock en espanol', 'corrido', 'deep regional mexican', 'colombian rock', 'tipico', 'mexican rock-and-roll', 'jovem guarda', 'nica', 'pop romantico', 'argentine reggae', 'salsa puertorriquena', 'latino', 'spanish pop rock', 'post-punk argentina', 'cha-cha-cha', 'cuban rumba', 'modern salsa', 'spanish new wave', 'musica aragonesa', 'chicano rap', 'chilean hardcore', 'chilean rock', 'nu-cumbia', 'chilean indie', 'latintronica', 'malay', 'classic malaysian pop', 'malaysian pop', 'malaysian indie', 'rock kapak', 'classic indo pop', 'indonesian indie', 'indonesian pop', 'musik anak-anak', 'dangdut koplo', 'indonesian city pop', 'dangdut', 'indonesian jazz', 'malaysian hip hop', 'indonesian r&b', 'indonesian rock', 'indonesian alternative rock', 'mandopop', 'zhongguo feng', 'taiwan singer-songwriter', 'singaporean pop', 'taiwan indie', 'mainland chinese pop', 'chinese minyao', 'malaysian mandopop', 'taiwan hip hop', 'taiwan campus folk', 'chinese folk', 'metal', 'brazilian metal', 'brazilian thrash metal', 'nu-metalcore', 'danish metal', 'danish rock', 'pirate', 'celtic metal', 'deep melodic metalcore', 'french death metal', 'french metal', 'psychedelic doom', 'sludge metal', 'metal-misc', 'metalcore', 'post-screamo', 'christian hardcore', 'christian rock', 'swiss metal', 'minimal-techno', 'brazilian house', 'raw techno', 'polish techno', 'italian techno', 'german tech house', 'munich electronic', 'spanish techno', 'frankfurt electronic', 'irish techno', 'danish techno', 'croatian electronic', 'schranz', 'deep tech house', 'israeli techno', 'movies', 'epicore', 'video game music', 'theme', 'mpb', 'brazilian ska', 'new-age', 'healing', 'new age', 'operatic pop', 'neoclassical darkwave', 'oceania soundtrack', 'medieval folk', 'choral', 'belgian contemporary classical', 'minimalism', 'modular synth', 'kirtan', 'meditation', 'medieval rock', 'rune folk', 'celtic harp', 'new-release', 'vapor pop', 'underground hip hop', 'swedish soul', 'teen pop', 'scandipop', 'indie quebecois', 'opera', 'german opera', 'classical tenor', 'italian tenor', 'classical soprano', 'english baroque', 'canzone napoletana', 'deep soft rock', 'yacht rock', 'pagode', 'modern samba', 'coco', 'funk ostentacao', 'roda de samba', 'party', 'cali rap', 'chicago drill', 'drill', 'philippines-opm', 'classic opm', 'opm', 'pinoy reggae', 'pinoy rock', 'pinoy indie', 'pinoy alternative rap', 'pinoy hip hop', 'pinoy praise', 'manila sound', 'papuri', 'kundiman', 'reggae en espanol', 'reggae mexicano', 'piano', 'christian relaxative', '432hz', 'japanese classical', 'japanese soundtrack', 'lds', 'classify', 'chamber folk', 'cello', 'pop', 'san diego rap', 'pop-film', 'australian rock', 'merseybeat', 'surf music', 'classic psychedelic rock', 'sevilla indie', 'post-dubstep', 'fluxwork', 'hyperpop', 'slam poetry', 'wave', 'vogue', 'luxembourgian indie', 'glitch pop', 'power-pop', 'underground power pop', 'pub rock', 'vancouver indie', 'australian alternative rock', 'electrofox', 'nederpop', 'queercore', 'dallas indie', 'paisley underground', 'progressive-house', 'melbourne bounce', 'focus trance', 'psych-rock', 'indie surf', 'garage psych', 'psych gaze', 'space rock', 'dark post-punk', 'grave wave', 'dutch indie rock', 'psychedelic pop', 'canterbury scene', 'japanese psychedelic', 'japanese psychedelic rock', 'japanoise', 'brazilian neo-psychedelic', 'punk', 'cincinnati indie', 'easycore', 'christian punk', 'new jersey indie', 'modern ska punk', 'adelaide indie', 'danish punk', 'psychobilly', 'orgcore', 'fast melodic punk', 'dc indie', 'chicago pop punk', 'vegan straight edge', 'progressive post-hardcore', 'swancore', 'cleveland indie', 'italian pop punk', 'ska revival', 'texas pop punk', 'missouri indie', 'uk pop punk', 'sleaze rock', 'warrington indie', 'diy emo', 'canadian ccm', 'screamocore', 'milwaukee indie', 'west virginia indie', 'punk-rock', 'celtic punk', 'r-n-b', 'lgbtq+ hip hop', 'southern soul blues', 'smooth saxophone', 'trap queen', 'polynesian pop', 'waiata maori', 'bedroom soul', 'uk drill', 'rainy-day', 'environmental', 'sleep', 'charlottesville indie', 'cape town indie', 'reggae', 'rock steady', 'italian reggae', 'uk reggae', 'east coast reggae', 'reggaeton', 'flamenco urbano', 'pop flamenco', 'dominican pop', 'rap dominicano', 'electro bailando', 'pop reggaeton', 'road-trip', 'jig and reel', 'rock', 'gymcore', 'icelandic rock', 'cambridgeshire indie', 'rock-n-roll', 'neo-rockabilly', 'new wave of glam metal', 'rockabilly', 'swedish rockabilly', 'deep psychobilly', 'german rockabilly', 'classic finnish rock', 'traditional rockabilly', 'romance', 'sad', 'grand rapids indie', 'worship', 'talent show', 'alternative pop rock', 'salsa', 'salsa peruana', 'kizomba', 'salsa venezolana', 'ecuadorian pop', 'timba', 'puerto rican folk', 'salsa cubana', 'salsa choke', 'charanga', 'cubaton', 'merengue', 'bolero cubano', 'mambo', 'samba', 'samba reggae', 'samba-enredo', 'chinese traditional', 'capoeira', 'sertanejo', 'sertanejo tradicional', 'bandinhas', 'viola caipira', 'show-tunes', 'west end', 'orchestral performance', 'singer-songwriter', 'scottish singer-songwriter', 'indy indie', 'ska', 'folk punk', 'euroska', 'swedish hip hop', 'euskal rock', 'punk euskera', 'spanish punk', 'sleep', 'spa', 'songwriter', 'alternative roots rock', 'cosmic american', 'canadian americana', 'soul', 'soundtracks', 'latin soundtrack', 'spanish', 'tejano', 'cuatro venezolano', 'study', 'pianissimo', 'summer', 'nottingham indie', 'swedish', 'swedish gangsta rap', 'swedish urban', 'swedish indie rock', 'komedi', 'swedish post-punk', 'swedish eurodance', 'swedish jazz', 'swedish blues', 'swedish prog', 'folkmusik', 'visor', 'nyckelharpa', 'swedish fiddle', 'synth-pop', 'tango', 'neotango', 'bandoneon', 'vintage tango', 'nuevo tango', 'orquesta tipica', 'tango cancion', 'deep downtempo fusion', 'klezmer', 'polish folk', 'british dance band', 'vintage jazz', 'rock nacional', 'techno', 'italo dance', 'hands up', 'bubble trance', 'trance', 'hard trance', 'full on', 'nitzhonot', 'deep progressive trance', 'trip-hop', 'world fusion', 'electro dub', 'bleep techno', 'turkish', 'turkish pop', 'turkish rock', 'arabesk', 'turkish folk', 'deep turkish pop', 'anadolu rock', 'kurdish folk', 'kurdish pop', 'turkish singer-songwriter', 'karadeniz halk muzigi', 'turkish psych', 'turkish instrumental', 'turkish alternative', 'turkish alternative rock', 'work-out', 'world-music', 'beninese pop', 'pet calming', 'chicha', "canzone d'autore", 'gumbe', 'morna', 'garifuna folk', 'punta', 'balkan brass', 'gypsy', 'cape verdean folk', 'twoubadou', 'native american', 'gypsy fusion', 'dutch pop', 'classic arab pop', 'rai', 'gypsy punk', 'jewish hip hop', 'portuguese pop', 'arabic jazz'].sort();
    const [selectedGenre, setSelectedGenre] = React.useState("")


    const getRecommended = (event) => {

        setSelectedGenre(event.target.textContent);
        data.getTracks(event.target.textContent);

    }

    return (<div>
        <h2 style={{fontFamily: 'Montserrat'}}>All Genres</h2>
        <List>
        {all_genres.map((genre, index) =>
            <ListItem selected={selectedGenre == genre} value={genre} style={{fontFamily: 'Montserrat'}} divider={true} onClick={getRecommended}>
                <ListItemText value={genre} primary={genre} onClick={getRecommended} />
            </ListItem>

        )}
        </List>

    </div>)

}

export function RecommendedTracksPanel(data) {

        console.log(data.recommended)

        return (
        <div>

                <div>
                           <h1 className="search-header">Search Results</h1>
                <TableContainer style={{marginLeft: '10px'}} component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell size="medium" className="table-header" classes="table-header" align="left">Track Name</TableCell>
                        <TableCell size="medium" className="table-header" classes="table-header" align="left">Artist</TableCell>
                        <TableCell size="medium" className="table-header" classes="table-header" align="right">Duration</TableCell>
                        <TableCell size="medium" className="table-header" classes="table-header" align="right">Popularity</TableCell>
                        <TableCell size="medium" className="table-header" classes="table-header" align="center">Genre</TableCell>
                      </TableRow>
                    </TableHead>

                    {'recommended' in data && data['recommended'].map((track,index) =>
            <TableRow key={track['name']} component="a" href={`/track/${track['id']}`}>
              <TableCell className="table-results" component="th" scope="row">
                <div className="avatar-head">
                    <Avatar className="table-avatar" src={track['album']['images'].length > 0 ? track['album']['images'][0]['url'] : ""} />&emsp; <h6 className="track-name">{track.name}</h6>
                </div>
              </TableCell>
              <TableCell className="table-results" align="left">{track['artists'][0]['name']}</TableCell>
              <TableCell className="table-results" align="right">{Math.trunc(track['duration_ms']/60000) + ":" +
                        Math.trunc((track['duration_ms']/60000-Math.trunc(track['duration_ms']/60000))*60)}</TableCell>
              <TableCell className="table-results" align="right">{track['popularity']}</TableCell>
              <TableCell className="table-results" align="center">{data['artist_info'][index]['genres'].join(", ")}</TableCell>
            </TableRow>

                     )}
                     {!data['recommended'] &&
                  <div class="loading">
                    <CircularProgress/>
                  </div>
              }

               </Table>
               </TableContainer>
            </div>












        </div>

        );

}



class RecommendedPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {};
        this.getRecommendedTracks = this.getRecommendedTracks.bind(this)

    }

    async componentDidMount() {
        let token = cookie.get('access_token');
        axios.get(`/api/user_info/${token}/`)
        .then(res => {
            console.log(res.data);
            this.setState(res.data[0]);

        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })




    }

//    followers: {href: null, total: 12}
//getTracks: getRecommendedTracks(genre) { console.log(this); let token = js_cookie__WEBPACK_IMPORTED_MODULE_1___default.a.get('access_token'); axios__WEBPACK_IMPORTED_MODULE_2___default.a.get(`/api/recommended_by_genre/${genre}/${token}/`).then(res => {…}
//image_url: "https://i.scdn.co/image/ab6775700000ee85e139fd8a5a369bcef81fddfc"
//long_genre_scores: (91) [11, 10, 10, 9, 7, 7, 7, 6, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//long_term_genres: (91) ["indie pop", "rap", "modern rock", "hip hop", "indie rock", "pop", "pop rap", "indietronica", "bedroom pop", "conscious hip hop", "chillwave", "edm", "alternative r&b", "rock", "indie r&b", "shimmer pop", "neo mellow", "modern alternative rock", "lo-fi beats", "indie poptimism", "ninja", "new rave", "lo-fi", "pop rock", "indie garage rock", "alternative dance", "electropop", "downtempo", "chillhop", "chicago rap", "vapor twitch", "singer-songwriter", "underground hip hop", "stomp and holler", "tropical house", "montreal indie", "neo soul", "new jersey indie", "vapor soul", "vancouver indie", "north carolina hip hop", "northern irish indie", "quebec indie", "nu gaze", "punk blues", "toronto indie", "slow core", "nu jazz", "oakland indie", "shimmer psych", "orlando indie", "oslo indie", "pittsburgh rap", "trip hop", "toronto rap", "jazztronica", "melodic rap", "dfw rap", "dance-punk", "canadian pop", "canadian indie", "canadian hip hop", "boston indie", "dmv rap", "baroque pop", "australian electropop", "australian dance", "atl hip hop", "art pop", "anti-folk", "alternative rock", "australian indie", "miami hip hop", "dream pop", "electronica", "melbourne indie", "melancholia", "lgbtq+ hip hop", "viral pop", "japanese chillhop", "irish rock", "edmonton indie", "indie soul", "indie dream pop", "future bass", "freak folk", "folk-pop", "etherpop", "emo rap", "indie folk", "west coast rap"]
//short_genre_scores: (38) [6, 5, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//short_term_genres: (38) ["indie pop", "modern rock", "pop", "vapor soul", "alternative r&b", "underground hip hop", "indietronica", "new rave", "indie rock", "chillwave", "indie garage rock", "vancouver indie", "ninja", "orlando indie", "permanent wave", "neo soul", "seattle hip hop", "soundtrack", "trap soul", "tropical house", "oakland indie", "aggrotech", "indie soul", "vapor twitch", "indie r&b", "hip hop", "escape room", "electra", "dance-punk", "chicago indie", "channel islands indie", "canadian contemporary r&b", "bedroom soul", "bedroom pop", "austindie", "alternative dance", "lgbtq+ hip hop", "wonky"]
//subscription: "premium"
//user_id: "screamywill"
//user_url: "https://open.spotify.com/user/screamywill"
//username: "screamywill"

    getRecommendedTracks(genre) {
        console.log(this);
        let token = cookie.get('access_token');
        axios.get(`/api/recommended_by_genre/${genre}/${token}/`)
        .then(res => {
            console.log(res.data);
            this.setState(oldState => ({
                followers: oldState.followers,
                getTracks: oldState.getTracks,
                image_url: oldState.image_url,
                long_genre_scores: oldState.long_genre_scores,
                long_term_genres: oldState.long_term_genres,
                short_genre_scores: oldState.short_genre_scores,
                short_term_genres: oldState.short_term_genres,
                subscription: oldState.subscription,
                user_id: oldState.user_id,
                user_url: oldState.user_url,
                username: oldState.username,
                recommended: res.data.search.tracks.items,
                artist_info: res.data.artist_info


            }))

        })
        .catch(err => {
            console.log('yo')
            console.log(err)
        })

    }



    render() {
        return (
            <div style={{marginTop: `2vh`, marginLeft: '84px', width: '92%'}}>
                {'username' in this.state &&

                <Grommet style={{overflow: 'hidden', width: '100%',backgroundColor: "#EBEBEB"}} full>
            <Distribution style={{overflow: 'hidden'}} margin="xsmall" gap="none"
              fill
              values={[
                { value: 15, color: "white", overflow: false, title: "Short term genres", data: <GenreChart mobile={false} data={this.state} chart="doughnut" range="long" /> },
                { value: 15, color: "white", overflow: true, title: "Long term genres", data: <ScrollGenres {...this.state} getTracks={this.getRecommendedTracks} /> },
                { value: 30, color: "white", overflow: true, title: "", data: <RecommendedTracksPanel {...this.state} /> },
              ]}
            >
                {value => (

                    <Card width="100%" height="100%" style={{backgroundColor: "white", overflow: value.overflow ? 'scroll': 'hidden'}} className="userinfo-card">
                        {value.data}
                    </Card>

              )}
                </Distribution>
          </Grommet>

                }


             {!this.state['username'] &&
                  <div class="loading">
                    <CircularProgress/>
                  </div>
              }


            </div>

        );

    }



}
export default RecommendedPage;


























