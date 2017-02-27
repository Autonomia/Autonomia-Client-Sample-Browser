
// React
import React from "react"

// Bootstrap
import { Navbar, Nav, NavItem } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

const style = {
    position: "absolute",
    top: "-10px", 
    bottom: "-10px", 
    height: "70px"
};

const headerStyle = {
    fontFamily: "Verdana",
    fontSize: "30px"
};

const Header = () => (
    <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
                <img src="images/logo.png" style={style} />
            </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
            <NavItem><LinkContainer to="MainPage"><span>Main Page</span></LinkContainer></NavItem>
            <NavItem><LinkContainer to="About"><span>About</span></LinkContainer></NavItem>
        </Nav>
    </Navbar>
)

module.exports = Header