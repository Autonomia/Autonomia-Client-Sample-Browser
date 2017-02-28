
// React
import React from "react"
import Link from "react-router"

// Bootstrap
// import { Navbar, Nav, NavItem } from "react-bootstrap"
// import { LinkContainer } from "react-router-bootstrap"

const style = {
    position: "absolute",
    top: "-10px", 
    bottom: "-10px", 
    height: "70px"
};

const Header = () => (
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <span class="mdl-layout-title"><img src="images/logo.png" style={style} /></span>
            <div class="mdl-layout-spacer"></div>
            <nav class="mdl-navigation mdl-layout--large-screen-only">
                <a class="mdl-navigation__link" href=""><Link to="Home"><span>Home</span></Link></a>
                <a class="mdl-navigation__link" href=""><Link to="About"><span>About</span></Link></a>
            </nav>
        </div>
    </header>
)

module.exports = Header