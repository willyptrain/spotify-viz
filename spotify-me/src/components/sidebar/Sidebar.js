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
    background: '#343834',
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
    background: '#343834',
    color: '#DFE0E3'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
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
  <Link href= "/logout" onClick={logout}>Logout</Link>
);
const guestLinks = (
  <Link href="/login">Login</Link>
);


export default function MiniDrawer(userInfo) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
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
  console.log(userInfo);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{backgroundColor: '#343834', color: '#DFE0E3'}} className={classes.customizeToolbar} >
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
          <Typography variant="h6" noWrap>
          {userInfo.userInfo === `Not logged in` ? guestLinks : userLinks}
          
          </Typography>
        </Toolbar>
      </AppBar>
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
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
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
        <List>
          {['Graphs'].map((text, index) => (
            <ListItem button component="a" href="/graphs" key={text}>
              <ListItemIcon>{graph_icons[index]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
