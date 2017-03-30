import {createStore} from 'redux'
import {reducer} from './reducers/root-reducer'

export default const store = createStore(reducer)
