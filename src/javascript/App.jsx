
// React
import React from 'react'
import ReactDOM from 'react-dom'

import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { Provider } from 'react-redux'

// App
import { store } from './components/Store'
import Header from './components/Header'

import Home from './pages/Home'
import About from './pages/About'

export default class AppLayout extends React.Component {
    render() {
        return (
            <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <Header />
                <main class="mdl-layout__content">
                    <div class="page-content">
                        {this.props.children}
                    </div>
                </main>
            </div>
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