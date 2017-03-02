
const redux = require('redux')
const reactRedux = require('react-redux')

import { DevicesReducer } from "../reducers/DevicesReducer"

const store = redux.createStore(
    redux.combineReducers({
        DevicesReducer
    })
);

module.exports = { store }