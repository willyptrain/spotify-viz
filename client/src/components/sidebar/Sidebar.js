import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from'@material-ui/icons/Home';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import AlbumIcon from '@material-ui/icons/Album';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import BarChartIcon from '@material-ui/icons/BarChart';
import Link from '@material-ui/core/Link';
import {logout} from '../../util/auth.js';
import './sidebar.css'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Redirect from '../../components/common/Redirect.jsx';
import TextField from '@material-ui/core/TextField';
import cookie from 'js-cookie';
import axios from 'axios';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';




const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  paper: {
   background: 'red',   
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: 'rgba(21,21,21,1)',
    color: '#DFE0E3'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    background: 'rgba(21,21,21,1)',
    color: '#DFE0E3'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    position: 'absolute',
    right: '0px',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  customizeToolbar: {
    minHeight: 64,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const userLinks = (
  <form action="/logout">
    <input variant="outlined" type="submit" class="logs-user" value="Logout" />
</form>

);
const guestLinks = (

        <form action="/login">
    <input variant="outlined" type="submit" class="logs-user" value="Login" />
        </form>

);

const useStylesSearch = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    float: 'right',
    marginRight: '3%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));


export default function MiniDrawer(userInfo) {
  const classes = useStyles();
  const classesSearch = useStylesSearch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  let searchVal = 'searchTerm' in userInfo ? userInfo.searchTerm : '';
  const [searchValue, setSearchValue] = React.useState(searchVal);
  const [hideDropdown, setHideDropdown] = React.useState(true);
  const [dropdown, setDropdown] = React.useState([]);


  const icons = [{
      text: "Home",
      image: <HomeIcon style={{color: '#DFE0E3'}} />,
      link: "/dashboard",
  }, {
      text: "My Tracks",
      image: <LibraryMusicIcon style={{color: '#DFE0E3'}}/>,
      link: "/top_tracks"
  },{
      text: "My Albums",
      image: <AlbumIcon style={{color: '#DFE0E3'}}/>,
      link: "/top_albums",
  }, {
      text: "My Artists",
      image: <PersonOutlineIcon style={{color: '#DFE0E3'}}/>,
      link: "/top_artists"
  }
    ]



  const graph_icons = [<BarChartIcon style={{color: '#DFE0E3'}}/>]
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getAllTracks = (event) => {
    event.preventDefault();
    console.log(searchValue);
  }

  const searchTracks = (event) => {
    event.preventDefault();
  }

  const searchDropdown = (keyword) => {
    console.log(keyword);
    let token = cookie.get('access_token');
    axios.get(`/api/track/search/${keyword}/${token}`)
        .then(res => {
            console.log(res.data)
            setDropdown(oldState => ({
                tracks: res.data.search['tracks'].items,
                artist_info: res.data.artist_info
            }));
        })
        .catch(err => {
            console.log("error :(")
            console.log(err)
        })




  }



  const searchKeyPress = (event) => {


    if(event.key.toLowerCase() == "enter") {
        setHideDropdown(true);
        setSearchValue(event.target.value+event.key);
        userInfo.searchFunc(searchValue)

    } else if(event.key.toLowerCase() == "backspace") {
        if(event.target.value.length <= 1) {
            setHideDropdown(true);
            setSearchValue('');
        } else {
            setHideDropdown(false);
            searchDropdown(event.target.value)
            setSearchValue(event.target.value);

        }

    }
    else {
        console.log(event.target.value)
         if(event.target.value+event.key != '') {
            searchDropdown(event.target.value+event.key)
            setHideDropdown(false);
         } else if(event.target.value == '') {
            setHideDropdown(true);
         } else {
            searchDropdown(event.target.value+event.key)
            setHideDropdown(false);
         }

         setSearchValue(event.target.value+event.key);
    }

  }

  const searchRedirect = () => {
    if(userInfo.searchTerm) {
        return (<Redirect url={`/search/${userInfo.searchTerm}`} />);
    }
  }



  const onChange = React.useCallback(e => setDropdown(e.value), []);



  return (



    <div className={classes.root}>
        <div>
            {searchRedirect()}
        </div>
      <CssBaseline />

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
      <Toolbar style={{backgroundColor: 'rgba(21,21,21,1)', color: '#DFE0E3'}} className={classes.customizeToolbar} >
          {!open &&
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          }




        <div className={classes.toolbar}>
          {open && <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon style={{ color: "white" }} /> : <ChevronLeftIcon style={{ color: "white" }} />}
          </IconButton>}
        </div>
         </Toolbar>


        <Divider />
        <List>
          {icons.map((icon, index) => (
            <ListItem button component="a" href={icon.link} key={icon.text}>
              <ListItemIcon>{icon.image}</ListItemIcon>
              <ListItemText primary={icon.text} />
            </ListItem>
          ))}
        </List>
        <Divider />


              {open && ((userInfo.userInfo.status === `Not logged in` || userInfo.userInfo === null) ? guestLinks : userLinks)}
      </Drawer>






     <div class="search-bar">
        <Paper autocomplete="off" component="form" onSubmit={searchTracks} className={classesSearch.root}>
            <InputBase
                className={classesSearch.input}
                placeholder={searchValue}
                onKeyDown={searchKeyPress}
              />

          <Divider className={classesSearch.divider} orientation="vertical" />
          <IconButton onClick={searchTracks} className={classesSearch.iconButton} aria-label="search">
            <SearchIcon onClick={searchTracks} />
          </IconButton>
        </Paper>
       <div onChange={onChange} style={{width: '100%', float: 'right', display: (!hideDropdown ? 'block' : 'none')}}>

        <div className="autocomplete" onChange={onChange}>

            {'tracks' in dropdown && dropdown['tracks'].length > 0 &&
                dropdown['tracks'].map((track, index) =>

                    <Paper className="dropdown-container">
                        <List>
                        <ListItem>
                            <ListItemAvatar>
                              <Avatar
                                alt="Album Image"
                                src={track['album']['images'][0]['url']}
                              />
                            </ListItemAvatar>
                            <ListItemText primary={track['name']} secondary={track['artists'][0].name} />

                        </ListItem>
                    </List>
                    </Paper>

                )


            }

        </div>
       </div>

      </div>




    </div>
  );
}
