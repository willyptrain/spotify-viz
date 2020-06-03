
class items:

    def get_colors(self):
        color_list = """
        aquamarine, azure,
            black, blue,
            blueviolet, brown, burlywood, cadetblue,
            chartreuse, chocolate, coral, cornflowerblue,
            crimson, cyan, darkblue, darkcyan,
            darkgoldenrod, darkgray, darkgrey, darkgreen,
            darkkhaki, darkmagenta, darkolivegreen, darkorange,
            darkorchid, darkred, darksalmon, darkseagreen,
            darkslateblue, darkslategray, darkslategrey,
            darkturquoise, darkviolet, deeppink, deepskyblue,
            dimgray, dimgrey, dodgerblue, firebrick,
            floralwhite, forestgreen, fuchsia, gainsboro,
            ghostwhite, gold, goldenrod, gray, grey, green,
            greenyellow, honeydew, hotpink, indianred, indigo,
            ivory, khaki, lavender, lavenderblush, lawngreen,
            lemonchiffon, lightblue, lightcoral, lightcyan,
            lightgoldenrodyellow, lightgray, lightgrey,
            lightgreen, lightpink, lightsalmon, lightseagreen,
            lightskyblue, lightslategray, lightslategrey,
            lightsteelblue, lightyellow, lime, limegreen,
            linen, magenta, maroon, mediumaquamarine,
            mediumblue, mediumorchid, mediumpurple,
            mediumseagreen, mediumslateblue, mediumspringgreen,
            mediumturquoise, mediumvioletred, midnightblue,
            mintcream, mistyrose, moccasin, navajowhite, navy,
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
        return color_list
    
    def select_genres(self):
        return ['acoustic', 'alt-rock', 'alternative', 
                'ambient', 'anime', 'bluegrass', 'blues', 
                'chill', 'classical', 'club', 
                'country', 'dance', 
                'deep-house','disco', 
                'drum-and-bass', 'edm', 'electro', 
                'electronic', 'emo', 'folk',
                'goth','hard-rock'
                'heavy-metal', 'hip-hop', 'holidays',
                'house', 'indie'
                'jazz', 
                'k-pop', 'kids',
                'metal',
                'new-age','opera', 'party', 
                'piano', 'pop', 
                'punk', 
                'r-n-b', 'rainy-day', 'reggae',
                'rock-n-roll',
                'sad', 'salsa', 
                'sleep', 'soul', 
                'techno', 
                'work-out', 'world-music']

    def get_genres(self):
        return ['acoustic', 'afrobeat', 'alt-rock', 'alternative', 
                'ambient', 'anime', 'black-metal', 'bluegrass', 'blues', 
                'bossanova', 'brazil', 'breakbeat', 'british', 'cantopop', 
                'chicago-house', 'children', 'chill', 'classical', 'club', 
                'comedy', 'country', 'dance', 'dancehall', 'death-metal', 
                'deep-house', 'detroit-techno', 'disco', 'disney', 
                'drum-and-bass', 'dub', 'dubstep', 'edm', 'electro', 
                'electronic', 'emo', 'folk', 'forro', 'french', 'funk', 
                'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove',
                'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 
                'hardstyle', 'heavy-metal', 'hip-hop', 'holidays', 'honky-tonk', 
                'house', 'idm', 'indian', 'indie', 'indie-pop', 'industrial',
                'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz', 
                'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 
                'metal', 'metal-misc', 'metalcore', 'minimal-techno', 'movies', 
                'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party', 
                'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep', 
                'power-pop', 'progressive-house', 'psych-rock', 'punk', 
                'punk-rock', 'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 
                'road-trip', 'rock', 'rock-n-roll', 'rockabilly', 'romance',
                'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes', 
                'singer-songwriter', 'ska', 'sleep', 'songwriter', 'soul', 
                'soundtracks', 'spanish', 'study', 'summer', 'swedish', 
                'synth-pop', 'tango', 'techno', 'trance', 'trip-hop', 'turkish',
                'work-out', 'world-music']

    def all_genres(self):
            return ['acoustic', 'neo mellow', 'pop', 'pop rock', 'singer-songwriter', 'viral pop', 'channel pop', 'indie cafe pop', 'post-teen pop', 'folk-pop', 'modern rock', 'stomp and holler', 'alternative rock', 'grunge', 'permanent wave', 'post-grunge', 'piano rock', 'bossa nova cover', 'coverchill', 'uk pop', 'acoustic pop', 'utah indie', 'modern alternative rock', 'rock', 'indie folk', 'indiecoustica', 'anti-folk', 'classic swedish pop', 'swedish alternative rock', 'swedish pop', 'swedish singer-songwriter', 'dance pop', 'electropop', 'metropopolis', 'neo-singer-songwriter', 'british singer-songwriter', 'chamber pop', 'neo soul', 'r&b', 'urban contemporary', 'british soul', 'eau claire indie', 'melancholia', 'gothenburg indie', 'soft rock', 'beatlesque', 'britpop', 'madchester', 'lds youth', 'indie anthem-folk', 'canadian pop', 'celtic rock', 'adult standards', 'contemporary vocal jazz', 'lounge', 'soul', 'australian pop', 'ann arbor indie', 'michigan folk', 'michigan indie', 'indie pop', 'jacksonville indie', 'jam band', 'modern folk rock', 'boy band', 'art pop', 'europop', 'alternative metal', 'swedish americana', 'vocal jazz', 'uk americana', 'chamber psych', 'folktronica', 'canadian folk', 'canadian indie', 'new americana', 'downtempo', 'electronica', 'ninja', 'nu jazz', 'edm', 'pop rap', 'auckland indie', 'etherpop', 'indie electropop', 'shimmer pop', 'canadian singer-songwriter', 'deep new americana', 'classic rock', 'folk', 'folk rock', 'fingerstyle', 'british folk', 'swedish idol pop', 'lilith', 'irish singer-songwriter', 'afrobeat', 'afropop', 'kwaito', 'kwaito house', 'south african jazz', 'ethio-jazz', 'funk', 'malian blues', 'mande pop', 'world', 'afro dancehall', 'azontobeats', 'bongo flava', 'mbira', 'south african pop', 'sungura', 'azonto', 'rumba congolaise', 'soukous', 'detroit hip hop', 'hip hop', 'rap', 'griot', 'desert blues', 'makossa', 'broadway', 'disney', 'hollywood', 'movie tunes', 'mellow gold', 'latin', 'latin hip hop', 'puerto rican pop', 'reggaeton', 'nigerian hip hop', 'nigerian pop', 'album rock', 'francoton', 'french pop', 'ghanaian hip hop', 'jazz trumpet', 'african gospel', 'reggae fusion', 'kora', 'highlife', 'mbalax', 'zouglou', 'ugandan pop', 'african reggae', 'south african choral', 'guinean pop', 'mallet', 'alt-rock', 'alternative pop', 'dream pop', 'canadian metal', 'canadian rock', 'nu metal', 'boston rock', 'funk metal', 'funk rock', 'german alternative rock', 'emo', 'blues rock', 'dayton indie', 'halifax indie', 'indie rock', 'rock quebecois', 'gbvfi', 'jangle pop', 'power pop', 'lo-fi', 'post-punk', 'scottish indie', 'modern power pop', 'hard rock', 'comedy rock', 'comic', 'comic metal', 'rock drums', 'no wave', 'palm desert scene', 'stoner rock', 'art punk', 'art rock', 'dance rock', 'dance-punk', 'experimental rock', 'acoustic punk', 'punk', 'slow core', 'garage rock', 'brooklyn indie', 'e6fi', 'freak folk', 'indie punk', 'glam metal', 'alabama indie', 'modern blues rock', 'knoxville indie', 'math rock', 'cowpunk', 'athens indie', 'denver indie', 'alternative country', 'chicago indie', 'candy pop', 'noise pop', 'experimental', 'alternative', 'indietronica', 'alternative dance', 'baroque pop', 'brighton indie', 'la indie', 'australian indie', 'indie poptimism', 'rap metal', 'austindie', 'denton tx indie', 'uk alternative pop', 'irish rock', 'philly indie', 'pop punk', 'baltimore indie', 'chillwave', 'nz pop', 'new romantic', 'new wave', 'oxford indie', 'experimental pop', 'french shoegaze', 'neo-synthpop', 'shiver pop', 'alternative hip hop', 'british indie rock', 'ambient', 'intelligent dance music', 'compositional ambient', 'abstract', 'drift', 'american post-rock', 'cinematic post-rock', 'instrumental post-rock', 'braindance', 'focus', 'post-rock', 'ambient folk', 'ambient trance', 'psychill', 'space ambient', 'jazztronica', 'ambient house', 'minimal techno', 'american contemporary classical', 'danish alternative rock', 'danish indie', 'bow pop', 'ethereal wave', 'ambient worship', 'icelandic indie', 'big beat', 'trip hop', 'danish electronic', 'danish electropop', 'australian shoegaze', 'german electronica', 'neo-classical', 'ambient idm', 'dark jazz', 'livetronica', 'drone', 'canadian experimental', 'bass music', 'alternative americana', 'ambient psychill', 'dutch indie', 'drill and bass', 'boston indie', 'indie dream pop', 'icelandic classical', 'indie psych-pop', 'nu age', 'anime', 'anime cv', 'j-division', 'j-pop girl group', 'otacore', 'denpa-kei', 'idol rock', 'anime rock', 'j-idol', 'j-pop', 'j-poprock', 'j-rap', 'j-rock', 'vocaloid', 'japanese emo', 'visual kei', 'japanese singer-songwriter', 'japanese alternative rock', 'anime score', 'j-metal', 'j-indie', 'anime latino', 'j-dance', 'japanese city pop', 'enka', 'kayokyoku', 'japanese electropop', 'techno kayo', 'j-pixie', 'black-metal', 'black metal', 'death metal', 'groove metal', 'melodic death metal', 'dark black metal', 'metal', 'norwegian black metal', "black 'n' roll", 'blackened crust', 'ambient black metal', 'atmospheric black metal', 'autonomous black metal', 'black thrash', 'depressive black metal', 'swedish black metal', 'norwegian metal', 'british black metal', 'gothic metal', 'blackgaze', 'gothenburg metal', 'melodic black metal', 'folk black metal', 'folk metal', 'bluegrass', 'appalachian folk', 'bluegrass gospel', 'old-time', 'modern old-time', 'instrumental bluegrass', 'clean comedy', 'comedy', 'progressive bluegrass', 'neo-traditional bluegrass', 'country gospel', 'duluth indie', 'banjo', 'north carolina indie', 'jamgrass', 'mandolin', 'jug band', 'country', 'country rock', 'manitoba indie', 'family gospel', 'southern gospel', 'blues', 'chicago blues', 'electric blues', 'acid rock', 'modern blues', 'acoustic blues', 'boogie-woogie', 'louisiana blues', 'jazz blues', 'soul blues', 'harmonica blues', 'delta blues', 'rhythm and blues', 'british blues', 'country blues', 'traditional blues', 'soul jazz', 'british invasion', 'bossanova', 'bossa nova', 'sambass', 'forro', 'mpb', 'samba', 'baile pop', 'brazilian boogie', 'bossa nova jazz', 'brazilian composition', 'brazilian jazz', 'choro', 'velha guarda', 'jazz guitar', 'italian jazz fusion', 'fado', 'brazilian indie', 'latin classical', 'brazil', 'brazilian rock', 'rock gaucho', 'rock nacional brasileiro', 'pop nacional', 'nova mpb', 'rock alternativo brasileiro', 'latin alternative', 'mangue bit', 'funk carioca', 'funk das antigas', 'pagode baiano', 'brazilian punk', 'umbanda', 'sertanejo universitario', 'sertanejo', 'sertanejo pop', 'pagode', 'afrobeat brasileiro', 'brazilian hip hop', 'latin afrobeat', 'samba-rock', 'hard rock brasileiro', 'brazilian soul', 'brazilian psychedelic', 'brasilia indie', 'brazilian reggae', 'partido alto', 'folk brasileiro', 'brazilian emo', 'brazilian hardcore', 'breakbeat', 'rare groove', 'hardcore techno', 'rave', 'nu skool breaks', 'instrumental soul', 'classic progressive house', 'progressive house', 'progressive trance house', 'bboy', 'instrumental funk', 'liquid funk', 'drum and bass', 'drumfunk', 'stateside dnb', 'bristol electronic', 'jungle', 'ragga jungle', 'deep liquid bass', 'swiss hip hop', 'norwegian hip hop', 'disco house', 'complextro', 'electro house', 'hammond organ', 'jazz funk', 'jazz organ', 'deep dnb', 'minimal dnb', 'soundtrack', 'gabba', 'happy hardcore', 'bahamian pop', 'neurofunk', 'glitch hop', 'uk dnb', 'darkstep', 'jump up', 'brill building pop', 'bubblegum pop', 'northern soul', 'southern soul', 'disco', 'motown', 'post-disco', 'turntablism', 'cyberpunk', 'digital hardcore', 'german techno', 'rap rock', 'underground rap', 'jazz fusion', 'modern funk', 'go-go', 'hip house', 'deep dubstep', 'electronic trap', 'vapor twitch', 'jazz piano', 'smooth jazz', 'dutch trance', 'progressive trance', 'quiet storm', 'minimal tech house', 'british', 'girl group', 'new rave', 'glam rock', 'liverpool indie', 'mod revival', 'new wave pop', 'cantopop', 'c-pop', 'classic cantopop', 'hong kong rock', 'hong kong hip hop', 'chinese indie', 'hong kong indie', 'vintage chinese pop', 'mandopop', 'classic french pop', 'chinese audiophile', 'chinese jazz', 'classic mandopop', 'chinese indie rock', 'singaporean mandopop', 'chicago-house', 'acid house', 'chicago house', 'techno', 'deep house', 'deep soul house', 'broken beat', 'deep disco house', 'float house', 'footwork', 'atmospheric dnb', 'detroit techno', 'electro jazz', 'chicago rap', 'detroit house', 'minneapolis sound', 'house', 'vocal house', 'electro', 'harlem hip hop', 'minimal dub', 'tech house', 'deep groove house', 'classic soul', 'speed garage', 'children', 'canadian soundtrack', 'show tunes', "children's music", 'kindie rock', "australian children's music", 'neon pop punk', 'big room', 'miami hip hop', 'barbadian pop', 'social media pop', 'cartoon', 'nursery', 'geek rock', 'zolo', 'australian dance', 'australian electropop', "children's choir", 'australian hip hop', 'hip pop', 'contemporary country', 'country pop', 'country road', 'doo-wop', 'sunshine pop', 'latin viral pop', 'rap latina', 'chill', 'deep tropical house', 'new french touch', 'indie r&b', 'dutch hip hop', 'tropical house', 'bmore', 'reggae', 'new orleans rap', 'g funk', 'gangster rap', 'canadian contemporary r&b', 'reggae rock', 'uk dance', 'nu gaze', 'german pop', 'israeli pop', 'irish pop', 'french soundtrack', 'ska mexicano', 'ska punk', 'classical', 'avant-garde', 'contemporary classical', 'german soundtrack', 'classical harp', 'acousmatic', 'early modern classical', 'late romantic era', 'british modern classical', 'post-romantic era', 'canadian classical', 'middle earth', 'scorecore', 'classic soundtrack', 'italian soundtrack', 'vintage italian soundtrack', 'baroque', 'early music', 'italian baroque', 'american modern classical', 'early romantic era', 'polish classical', 'classical era', 'norwegian classical', 'harpsichord', 'italian opera', 'post-minimalism', 'german baroque', 'russian modern classical', 'french opera', 'operetta', 'impressionism', '21st century classical', 'american 21st century classical', 'classical performance', 'opera', 'orchestra', 'victorian britain', 'violin', 'neoclassicism', 'austro-german modernism', 'baltic classical', 'icelandic pop', 'finnish classical', 'british contemporary classical', 'british soundtrack', 'classical piano', 'turkish jazz', 'russian romanticism', 'tin pan alley', 'club', 'filter house', 'bitpop', 'deep big room', 'escape room', 'grime', 'diva house', 'eurodance', 'brostep', 'catstep', 'bass trap', 'dubstep', 'deep euro house', 'belgian pop', 'german dance', 'trance', 'moombahton', 'future garage', 'austrian pop', 'microhouse', 'electro latino', 'latin pop', 'dutch edm', 'destroy techno', 'balearic', 'dutch house', 'bubblegum dance', 'canadian electronic', 'uk funky', 'comedy', 'comedienne', 'deep comedy', 'latino comedy', 'new comedy', 'british comedy', 'black comedy', 'canadian comedy', 'haitian gospel', 'country', 'modern country rock', 'country dawn', 'arkansas country', 'outlaw country', 'oklahoma country', 'heartland rock', 'australian country', 'roots rock', 'alberta country', 'canadian contemporary country', 'canadian country', 'redneck', 'pop emo', 'modern southern rock', 'texas country', 'bakersfield sound', 'country rap', 'dance', 'afrofuturism', 'asian american hip hop', 'aussietronica', 'indie soul', 'swedish electropop', 'electra', 'gauze pop', 'uplifting trance', 'bass house', 'fidget house', 'belgian edm', 'australian house', 'zapstep', 'pop edm', 'street punk', 'nu disco', 'progressive uplifting trance', 'dancehall', 'lovers rock', 'modern reggae', 'roots reggae', 'jawaiian', 'soca', 'danish hip hop', 'panamanian pop', 'chutney', 'conscious hip hop', 'danish pop', 'swedish dancehall', 'swedish reggae', 'old school dancehall', 'riddim', 'funana', 'deep ragga', 'dub', 'rap kreyol', 'basshall', 'tropical', 'death-metal', 'brutal death metal', 'deathgrind', 'florida death metal', 'birmingham metal', 'crossover thrash', "death 'n' roll", 'melodic groove metal', 'finnish death metal', 'finnish metal', 'melodic metalcore', 'buffalo ny metal', 'swedish death metal', 'swedish metal', 'italian death metal', 'symphonic death metal', 'german death metal', 'jazz metal', 'polish death metal', 'djent', 'deep-house', 'hamburg electronic', 'melodic techno', 'brazilian edm', 'italian tech house', 'irish electronic', 'french indie pop', 'french rock', 'swedish electronic', 'swedish techno', 'lithuanian electronic', 'deep techno', 'latin tech house', 'pop house', 'german house', 'groove room', 'leipzig electronic', 'canadian house', 'deep melodic euro house', 'dub techno', 'house argentino', 'dark techno', 'deep minimal techno', 'funky tech house', 'detroit-techno', 'french techno', 'tribal house', 'proto-techno', 'dark disco', 'acid trance', 'dusseldorf electronic', 'ambient techno', 'scottish techno', 'dutch tech house', 'electroclash', 'taiwan pop', 'disco', 'philly soul', 'k-pop', 'k-rap', 'hi-nrg', 'brit funk', 'east coast hip hop', 'italian disco', 'c86', 'dunedin indie', 'dunedin sound', 'romanian pop', 'chicago soul', 'progressive electro house', 'classic uk pop', 'disney', 'tagalog worship', 'classic canadian rock', 'celtic', 'scottish folk', 'cowboy western', 'rock-and-roll', 'rockabilly', 'brazilian modern jazz', 'new jack swing', 'drum-and-bass', 'finnish edm', 'chillstep', 'gaming edm', 'bassline', 'deep liquid', 'afro house', 'belgian rock', 'substep', 'uk alternative hip hop', 'slovak electronic', 'dub', 'filthstep', 'future rock', 'dubstep product', 'uk hip hop', 'industrial metal', 'glitch', 'dubstep', 'jazz boom bap', 'deathstep', 'nz electronic', 'instrumental grime', 'london rap', 'edm', 'dakke dak', 'chiptune', 'future funk', 'indie game soundtrack', 'jamtronica', 'screamo', 'trancecore', 'future house', 'pop violin', 'nordic house', 'indie jazz', 'purple sound', 'scottish electronic', 'scottish hip hop', 'deep uplifting trance', 'electro swing', 'classic hardstyle', 'electro trash', 'psychedelic trance', 'deep pop edm', 'nintendocore', 'swedish synth', 'electro', 'belgian dance', 'electronic', 'wonky', 'indie garage rock', 'comedy rap', 'vaporwave', 'canadian electropop', 'edmonton indie', 'danish indie pop', 'german rock', 'icelandic electronic', 'electronic rock', 'emo', 'alternative emo', 'dreamo', 'metalcore', 'pixie', 'post-hardcore', 'midwest emo', 'socal pop punk', 'uk metalcore', 'canadian pop punk', 'canadian punk', 'christian metal', 'dc hardcore', 'emo punk', 'emocore', 'canadian post-hardcore', 'folk', 'australian indie folk', 'rhode island indie', 'swedish country', 'albuquerque indie', 'french indietronica', 'austin americana', 'forro', 'brazilian percussion', 'forro tradicional', 'accordion', 'baiao', 'pernambuco alternative', 'axe', 'brega', 'vaqueiro', 'carimbo', 'tecnobrega', 'french', 'chanson', 'torch song', 'vintage schlager', 'belgian singer-songwriter', 'french hip hop', 'pop urbaine', 'variete francaise', 'nouvelle chanson francaise', 'french jazz', 'cabaret', 'vintage hollywood', 'chanson paillarde', 'french folk pop', 'colombian pop', 'ye ye', 'rap conscient', 'french reggae', 'rock alternatif francais', 'funk', 'danish jazz', 'deep funk', 'portland hip hop', 'brass band', 'p funk', 'psychedelic rock', 'new orleans funk', 'acid jazz', 'garage', 'uk garage', 'australian garage punk', 'bay area indie', 'gothabilly', 'classic garage rock', 'freakbeat', 'uk dancehall', 'atl hip hop', 'deep pop r&b', 'garage rock revival', 'punk blues', 'garage pop', 'neo-psychedelic', 'german hip hop', 'old school thrash', 'glam punk', 'action rock', 'swedish garage rock', 'protopunk', 'trash rock', 'tucson indie', 'birmingham hip hop', 'atlanta indie', 'german', 'german alternative rap', 'partyschlager', 'schlager', 'german pop rock', 'persian pop', 'german indie', 'classic schlager', 'christlicher rap', 'deep german hip hop', 'german cloud rap', 'liedermacher', 'neue deutsche welle', 'hamburg hip hop', 'german indie rock', 'turkish hip hop', 'german metal', 'neue deutsche harte', 'german singer-songwriter', 'eurovision', 'german reggae', 'alpine yodeling', 'discofox', 'austropop', 'neue volksmusik', 'uk contemporary r&b', 'kolsche karneval', 'german indie pop', 'gospel', 'praise', 'gospel r&b', 'contemporary gospel', 'naija worship', 'anthem worship', 'ccm', 'christian alternative rock', 'christian music', 'world worship', 'christian hip hop', 'goth', 'finnish power metal', 'gothic symphonic metal', 'dark wave', 'gothic rock', 'dutch metal', 'power metal', 'corrosion', 'finnish hard rock', 'opera metal', 'italian gothic', 'italian gothic metal', 'italian metal', 'cyber metal', 'industrial rock', 'deathrock', 'industrial', 'norwegian doom metal', 'symphonic metal', 'slayer', 'neue deutsche todeskunst', 'finnish alternative rock', 'grindcore', 'mathcore', 'crust punk', 'noisecore', 'goregrind', 'powerviolence', 'boston hardcore', 'chaotic hardcore', 'belgian metal', 'groove', 'synthpop', 'memphis soul', 'piano blues', 'freestyle', 'relaxative', 'classic girl group', 'grunge', 'south african rock', 'guitar', 'progressive metal', 'speed metal', 'instrumental rock', 'metal guitar', 'neo classical metal', 'instrumental surf', 'mexican classic rock', 'chicago hardcore', 'chicago punk', 'hardcore punk', 'australian psych', 'progressive rock', 'noise rock', 'happy', 'ectofolk', 'scottish rock', 'swedish indie pop', 'british alternative rock', 'dirty south rap', 'hard-rock', 'nwobhm', 'early us punk', 'german hard rock', 'swedish power metal', 'dutch prog', 'dutch rock', 'hardcore', 'canadian hardcore', 'melodic hardcore', 'swedish hardcore', 'skate punk', 'connecticut hardcore', 'nyhc', 'boston punk', 'straight edge', 'horror punk', 'new jersey hardcore', 'new jersey punk', 'chicano punk', 'ska', 'd-beat', 'hardstyle', 'euphoric hardstyle', 'rawstyle', 'nederlandse hardstyle', 'melbourne bounce international', 'tekk', 'uptempo hardcore', 'sound effects', 'heavy-metal', 'viking metal', 'boston metal', 'progressive jazz fusion', 'melodic thrash', 'melodic metal', 'suomi rock', 'deathcore', 'melodic deathcore', 'doom metal', 'drone metal', 'post-doom metal', 'deathrash', 'thall', 'australian metalcore', 'miami metal', 'progressive metalcore', 'greek metal', 'german metalcore', 'prog metal', 'hip-hop', 'hardcore hip hop', 'indie pop rap', 'deep underground hip hop', 'melodic rap', 'west coast rap', 'dfw rap', 'old school hip hop', 'channel islands indie', 'vapor soul', 'bronx hip hop', 'canadian hip hop', 'atl trap', 'nc hip hop', 'alternative r&b', 'philly rap', 'southern hip hop', 'trap', 'baton rouge rap', 'pittsburgh rap', 'dmv rap', 'crunk', 'emo rap', 'florida rap', 'new jersey rap', 'holidays', 'deep adult standards', 'easy listening', 'space age pop', 'big band', 'swing', 'bebop', 'cool jazz', 'jazz', 'ballroom', 'vocal harmony group', 'american folk revival', 'exotica', 'laboratorio', 'jazz saxophone', 'christmas instrumental', 'jazz trio', 'a cappella', 'jazz trombone', 'motivation', 'dixieland', 'calypso', 'honky-tonk', 'nashville sound', 'traditional folk', 'honky tonk', 'dansband', 'danspunk', 'traditional country', 'classic country pop', 'house', 'la pop', 'vocal trance', 'idm', 'deep idm', 'breakcore', 'ambient pop', 'indie electronica', 'indian', 'desi pop', 'filmi', 'modern bollywood', 'sufi', 'afghan pop', 'hindi hip hop', 'classic pakistani pop', 'punjabi pop', 'indian folk', 'bhangra', 'desi hip hop', 'college a cappella', 'deep indian pop', 'pakistani pop', 'tamil hip hop', 'tamil pop', 'classic bollywood', 'ghazal', 'indie', 'anthem emo', 'british post-rock', 'cosmic post-rock', 'christchurch indie', 'bedroom pop', 'montreal indie', 'quebec indie', 'milwaukee hip hop', 'english indie rock', 'stomp pop', 'el paso indie', 'shoegaze', 'norwegian pop', 'indie-pop', 'industrial', 'ebm', 'electro-industrial', 'aggrotech', 'early synthpop', 'dark electro', 'futurepop', 'belgian new wave', 'british industrial', 'vintage french electronic', 'iranian', 'azeri traditional', 'classic persian pop', 'persian traditional', 'persian alternative', 'tar', 'arab folk', 'duduk', 'armenian pop', 'j-dance', 'andean', 'shibuya-kei', 'k-pop boy group', 'japanese jazztronica', 'j-reggae', 'japanese r&b', 'japanese techno', 'japanese experimental', 'japanese electronic', 'j-pop boy group', 'k-pop girl group', 'classic j-rock', 'j-ambient', 'japanese idm', 'circuit', 'avant-garde jazz', 'contemporary post-bop', 'japanese jazz fusion', 'j-idol', 'alt-idol', 'heavy alternative', 'kawaii metal', 'j-pop', 'eurobeat', 'j-acoustic', 'japanese metalcore', 'japanese jazz', 'japanese punk rock', 'japanese instrumental', 'j-rock', 'japanese ska', 'japanese post-hardcore', 'japanese soul', 'japanese rockabilly', 'japanese post-rock', 'japanese shoegaze', 'oshare kei', 'j-punk', 'japanese pop punk', 'japanese dream pop', 'japanese new wave', 'japanese garage rock', 'japanese math rock', 'japanese indie pop', 'japanese indie rock', 'jazz', 'hard bop', 'jazz cubano', 'latin jazz', 'classical trumpet', 'contemporary jazz', 'ecm-style jazz', 'modern jazz piano', 'electric bass', 'dutch jazz', 'free jazz', 'jazz brass', 'free improvisation', 'new orleans jazz', 'jazz violin', 'polish jazz', 'gypsy jazz', 'boogaloo', 'salsa', 'salsa international', 'k-pop', 'korean r&b', 'korean pop', 'korean jazz', 'new age piano', 'k-indie', 'k-rock', 'trot', 'kids', "children's folk", 'nueva cancion', "canadian children's music", "preschool children's music", 'language', 'musiikkia lapsille', 'lullaby', 'vbs', 'latin', 'reggaeton flow', 'spanish pop', 'banda', 'regional mexican', 'cantautor', 'nova canco', 'grupera', 'mariachi', 'ranchera', 'trap argentino', 'norteno', 'regional mexican pop', 'mexican pop', 'cumbia', 'salsa colombiana', 'perreo', 'trap latino', 'classic italian pop', 'italian pop', 'argentine indie', 'argentine rock', 'latin rock', 'latin arena pop', 'flamenco', 'flamenco guitar', 'rumba', 'zouk', 'bachata', 'champeta', 'cancion melodica', 'trap espanol', 'bolero', 'mexican rock', 'rock en espanol', 'corrido', 'deep regional mexican', 'colombian rock', 'tipico', 'mexican rock-and-roll', 'jovem guarda', 'nica', 'pop romantico', 'argentine reggae', 'salsa puertorriquena', 'latino', 'spanish pop rock', 'post-punk argentina', 'cha-cha-cha', 'cuban rumba', 'modern salsa', 'spanish new wave', 'musica aragonesa', 'chicano rap', 'chilean hardcore', 'chilean rock', 'nu-cumbia', 'chilean indie', 'latintronica', 'malay', 'classic malaysian pop', 'malaysian pop', 'malaysian indie', 'rock kapak', 'classic indo pop', 'indonesian indie', 'indonesian pop', 'musik anak-anak', 'dangdut koplo', 'indonesian city pop', 'dangdut', 'indonesian jazz', 'malaysian hip hop', 'indonesian r&b', 'indonesian rock', 'indonesian alternative rock', 'mandopop', 'zhongguo feng', 'taiwan singer-songwriter', 'singaporean pop', 'taiwan indie', 'mainland chinese pop', 'chinese minyao', 'malaysian mandopop', 'taiwan hip hop', 'taiwan campus folk', 'chinese folk', 'metal', 'brazilian metal', 'brazilian thrash metal', 'nu-metalcore', 'danish metal', 'danish rock', 'pirate', 'celtic metal', 'deep melodic metalcore', 'french death metal', 'french metal', 'psychedelic doom', 'sludge metal', 'metal-misc', 'metalcore', 'post-screamo', 'christian hardcore', 'christian rock', 'swiss metal', 'minimal-techno', 'brazilian house', 'raw techno', 'polish techno', 'italian techno', 'german tech house', 'munich electronic', 'spanish techno', 'frankfurt electronic', 'irish techno', 'danish techno', 'croatian electronic', 'schranz', 'deep tech house', 'israeli techno', 'movies', 'epicore', 'video game music', 'theme', 'mpb', 'brazilian ska', 'new-age', 'healing', 'new age', 'operatic pop', 'neoclassical darkwave', 'oceania soundtrack', 'medieval folk', 'choral', 'belgian contemporary classical', 'minimalism', 'modular synth', 'kirtan', 'meditation', 'medieval rock', 'rune folk', 'celtic harp', 'new-release', 'vapor pop', 'underground hip hop', 'swedish soul', 'teen pop', 'scandipop', 'indie quebecois', 'opera', 'german opera', 'classical tenor', 'italian tenor', 'classical soprano', 'english baroque', 'canzone napoletana', 'deep soft rock', 'yacht rock', 'pagode', 'modern samba', 'coco', 'funk ostentacao', 'roda de samba', 'party', 'cali rap', 'chicago drill', 'drill', 'philippines-opm', 'classic opm', 'opm', 'pinoy reggae', 'pinoy rock', 'pinoy indie', 'pinoy alternative rap', 'pinoy hip hop', 'pinoy praise', 'manila sound', 'papuri', 'kundiman', 'reggae en espanol', 'reggae mexicano', 'piano', 'christian relaxative', '432hz', 'japanese classical', 'japanese soundtrack', 'lds', 'classify', 'chamber folk', 'cello', 'pop', 'san diego rap', 'pop-film', 'australian rock', 'merseybeat', 'surf music', 'classic psychedelic rock', 'sevilla indie', 'post-dubstep', 'fluxwork', 'hyperpop', 'slam poetry', 'wave', 'vogue', 'luxembourgian indie', 'glitch pop', 'power-pop', 'underground power pop', 'pub rock', 'vancouver indie', 'australian alternative rock', 'electrofox', 'nederpop', 'queercore', 'dallas indie', 'paisley underground', 'progressive-house', 'melbourne bounce', 'focus trance', 'psych-rock', 'indie surf', 'garage psych', 'psych gaze', 'space rock', 'dark post-punk', 'grave wave', 'dutch indie rock', 'psychedelic pop', 'canterbury scene', 'japanese psychedelic', 'japanese psychedelic rock', 'japanoise', 'brazilian neo-psychedelic', 'punk', 'cincinnati indie', 'easycore', 'christian punk', 'new jersey indie', 'modern ska punk', 'adelaide indie', 'danish punk', 'psychobilly', 'orgcore', 'fast melodic punk', 'dc indie', 'chicago pop punk', 'vegan straight edge', 'progressive post-hardcore', 'swancore', 'cleveland indie', 'italian pop punk', 'ska revival', 'texas pop punk', 'missouri indie', 'uk pop punk', 'sleaze rock', 'warrington indie', 'diy emo', 'canadian ccm', 'screamocore', 'milwaukee indie', 'west virginia indie', 'punk-rock', 'celtic punk', 'r-n-b', 'lgbtq+ hip hop', 'southern soul blues', 'smooth saxophone', 'trap queen', 'polynesian pop', 'waiata maori', 'bedroom soul', 'uk drill', 'rainy-day', 'environmental', 'sleep', 'charlottesville indie', 'cape town indie', 'reggae', 'rock steady', 'italian reggae', 'uk reggae', 'east coast reggae', 'reggaeton', 'flamenco urbano', 'pop flamenco', 'dominican pop', 'rap dominicano', 'electro bailando', 'pop reggaeton', 'road-trip', 'jig and reel', 'rock', 'gymcore', 'icelandic rock', 'cambridgeshire indie', 'rock-n-roll', 'neo-rockabilly', 'new wave of glam metal', 'rockabilly', 'swedish rockabilly', 'deep psychobilly', 'german rockabilly', 'classic finnish rock', 'traditional rockabilly', 'romance', 'sad', 'grand rapids indie', 'worship', 'talent show', 'alternative pop rock', 'salsa', 'salsa peruana', 'kizomba', 'salsa venezolana', 'ecuadorian pop', 'timba', 'puerto rican folk', 'salsa cubana', 'salsa choke', 'charanga', 'cubaton', 'merengue', 'bolero cubano', 'mambo', 'samba', 'samba reggae', 'samba-enredo', 'chinese traditional', 'capoeira', 'sertanejo', 'sertanejo tradicional', 'bandinhas', 'viola caipira', 'show-tunes', 'west end', 'orchestral performance', 'singer-songwriter', 'scottish singer-songwriter', 'indy indie', 'ska', 'folk punk', 'euroska', 'swedish hip hop', 'euskal rock', 'punk euskera', 'spanish punk', 'sleep', 'spa', 'songwriter', 'alternative roots rock', 'cosmic american', 'canadian americana', 'soul', 'soundtracks', 'latin soundtrack', 'spanish', 'tejano', 'cuatro venezolano', 'study', 'pianissimo', 'summer', 'nottingham indie', 'swedish', 'swedish gangsta rap', 'swedish urban', 'swedish indie rock', 'komedi', 'swedish post-punk', 'swedish eurodance', 'swedish jazz', 'swedish blues', 'swedish prog', 'folkmusik', 'visor', 'nyckelharpa', 'swedish fiddle', 'synth-pop', 'tango', 'neotango', 'bandoneon', 'vintage tango', 'nuevo tango', 'orquesta tipica', 'tango cancion', 'deep downtempo fusion', 'klezmer', 'polish folk', 'british dance band', 'vintage jazz', 'rock nacional', 'techno', 'italo dance', 'hands up', 'bubble trance', 'trance', 'hard trance', 'full on', 'nitzhonot', 'deep progressive trance', 'trip-hop', 'world fusion', 'electro dub', 'bleep techno', 'turkish', 'turkish pop', 'turkish rock', 'arabesk', 'turkish folk', 'deep turkish pop', 'anadolu rock', 'kurdish folk', 'kurdish pop', 'turkish singer-songwriter', 'karadeniz halk muzigi', 'turkish psych', 'turkish instrumental', 'turkish alternative', 'turkish alternative rock', 'work-out', 'world-music', 'beninese pop', 'pet calming', 'chicha', "canzone d'autore", 'gumbe', 'morna', 'garifuna folk', 'punta', 'balkan brass', 'gypsy', 'cape verdean folk', 'twoubadou', 'native american', 'gypsy fusion', 'dutch pop', 'classic arab pop', 'rai', 'gypsy punk', 'jewish hip hop', 'portuguese pop', 'arabic jazz']
    
    def top_genres(self):
        return ['alternative', 
                'classical', 'club', 
                'country', 'edm', 
                'heavy-metal', 'hip-hop',
                'house', 'indie',
                'jazz',
                'pop', 
                'r-n-b',
                'rock-n-roll']