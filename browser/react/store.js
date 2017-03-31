import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import lyricsReducer from './reducers/lyrics-reducer.js'
import playerReducer from './reducers/player-reducer.js'

// /* eslint-disable no-underscore-dangle */
//   const store = createStore(
//    reducer, /* preloadedState, */
//    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   );
//  /* eslint-enable */

const combinedReducers = combineReducers({lyrics: lyricsReducer, player: playerReducer})

 const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 const store = createStore(combinedReducers, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware, createLogger())
  ));

 export default store
