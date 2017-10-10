import { createReducer, createActions } from 'reduxsauce'

/* ------------- Initial State ------------- */

const INITIAL_STATE = [
  { homeTeam: 'ECU', awayTeam: 'ARG', home: 0, away: 0 },
  { homeTeam: 'BRA', awayTeam: 'CHI', home: 0, away: 0 },
  { homeTeam: 'PAR', awayTeam: 'VEN', home: 0, away: 0 },
  { homeTeam: 'URU', awayTeam: 'BOL', home: 0, away: 0 },
  { homeTeam: 'PER', awayTeam: 'COL', home: 0, away: 0 }
]

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  update: ['round'],
  changeGoals: ['game', 'home', 'goals']
})

export default Creators

/* ------------- Reducers ------------- */
const update = (state, { round }) => round

const changeGoals = (state, { game, home, goals }) => [
  ...state.slice(0, game),
  {
    ...state[game],
    home: home ? goals : state[game].home,
    away: home ? state[game].away : goals
  },
  ...state.slice(game + 1, state.length)
]

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE]: update,
  [Types.CHANGE_GOALS]: changeGoals
})
