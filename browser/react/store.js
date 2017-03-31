import {createStore, applyMiddleware, compose} from 'redux'
import {reducer} from './reducers/root-reducer'
import {createLogger} from 'redux-logger'
import {thunkMiddleware} from 'redux-thunk'

// /* eslint-disable no-underscore-dangle */
//   const store = createStore(
//    reducer, /* preloadedState, */
//    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   );
//  /* eslint-enable */

 const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware, createLogger())
  ));

 export default store
