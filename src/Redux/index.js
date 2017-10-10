import { combineReducers, createStore } from 'redux'
import { reducer as round } from './Round'

const rootReducer = combineReducers({
  round
})

export default () => createStore(rootReducer)
