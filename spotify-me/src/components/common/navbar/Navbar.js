import React from "react";
import './Navbar.css';
import {Button, Navbar, Nav, NavDropdown, Form, FormControl} from 'react-bootstrap';
import {logout} from '../../../util/auth.js';

class NavBar extends React.Component{

    constructor(props) {
        super(props);
      }
    render(){
        const userLinks = (
            <Nav.Link href= "/logout" onClick={logout}>Logout</Nav.Link>
        );
        const guestLinks = (
            <Nav.Link href="/login">Login</Nav.Link>
        );
        console.log(this.props)
        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">Spotify-Viz</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                {this.props.userInfo === `Not logged in` ? guestLinks : userLinks}
                    <Nav className="mr-auto">
                    <NavDropdown title="Listening History" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/top_tracks">Top Tracks</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Top Albums</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Top Artists</NavDropdown.Item>
                        <NavDropdown.Divider />
                        {/*<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                    </NavDropdown>
                    <NavDropdown title="Graphs" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/top_tracks">Artists</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Albums</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Playlists</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">My Listening</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavBar;