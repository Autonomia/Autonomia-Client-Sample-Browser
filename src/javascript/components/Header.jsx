
// React
import React from "react"
import { Header as HeaderMdl, Navigation } from "react-mdl"


const style = {
    height: "45px"
};

const Header = () => (
    <HeaderMdl title={<img src="images/logo-white.png" style={style} />}>
        <Navigation>
            <a href="#Home">Home</a>
            <a href="#About">About</a>
        </Navigation>
    </HeaderMdl>
)

module.exports = Header