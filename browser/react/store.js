import {createStore} from 'redux'
import {reducer} from './reducers/root-reducer'

/* eslint-disable no-underscore-dangle */
  export default store = createStore(
   reducer, /* preloadedState, */
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
 /* eslint-enable */

