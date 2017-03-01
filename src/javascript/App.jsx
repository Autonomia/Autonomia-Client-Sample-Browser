
// React
import React from 'react'
import ReactDOM from 'react-dom'

import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { Provider } from 'react-redux'

// https://getmdl.io + https://github.com/react-mdl/react-mdl
// import "react-mdl/extra/material.css"
import "react-mdl/extra/material.js"
import { Layout, Content } from "react-mdl"

// App
import { store } from './components/Store'
import Header from './components/Header'

import Home from './pages/Home'
import About from './pages/About'

export default class AppLayout extends React.Component {
    render() {
        return (
            <Layout fixedHeader>
                <Header />
                <Content>
                    {this.props.children}
                </Content>
            </Layout>
        )
    }
}

const App = () => (
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={AppLayout}>
                <IndexRoute component={Home} />
                <Route path='Home' component={Home} />
                <Route path='About' component={About} />
            </Route>
        </Router>
    </Provider>
)

ReactDOM.render(
    <App />,
    document.getElementById('App')
)