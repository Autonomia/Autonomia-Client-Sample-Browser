
// React
import React from 'react'
import ReactDOM from 'react-dom'

import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { Provider } from 'react-redux'

// App
import { store } from './components/Store'
import Header from './components/Header'

import MainPage from './pages/MainPage'
import About from './pages/About'

export default class AppLayout extends React.Component {
    render() {
        return (
            <div>
                <Header />
                {this.props.children}
            </div>
        )
    }
}

const App = () => (
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={AppLayout}>
                <IndexRoute component={MainPage} />
                <Route path='MainPage' component={MainPage} />
                <Route path='About' component={About} />
            </Route>
        </Router>
    </Provider>
)

ReactDOM.render(
    <App />,
    document.getElementById('App')
)