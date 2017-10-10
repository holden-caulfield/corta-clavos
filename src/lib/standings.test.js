// @flow
import { applyRound, statusFor, scenariosFor, INITIAL_TABLE } from './standings'

describe('applyRound', () => {
  it('properly applies a new round to the current standings', () => {
    const round = [
      { homeTeam: 'ECU', awayTeam: 'ARG', home: 0, away: 1 },
      { homeTeam: 'BRA', awayTeam: 'CHI', home: 2, away: 0 },
      { homeTeam: 'PAR', awayTeam: 'VEN', home: 0, away: 0 },
      { homeTeam: 'URU', awayTeam: 'BOL', home: 0, away: 0 },
      { homeTeam: 'PER', awayTeam: 'COL', home: 0, away: 0 }
    ]

    const result = applyRound(INITIAL_TABLE, round)
    expect(result).toContainEqual({ team: 'ARG', pts: 28, gf: 17, ga: 15 })
    expect(result).toContainEqual({ team: 'CHI', pts: 26, gf: 26, ga: 26 })
    expect(result).toContainEqual({ team: 'PER', pts: 26, gf: 26, ga: 25 })
  })

  it('always return a sorted list', () => {
    const round = [
      { homeTeam: 'ECU', awayTeam: 'ARG', home: 0, away: 1 },
      { homeTeam: 'BRA', awayTeam: 'CHI', home: 2, away: 0 },
      { homeTeam: 'PAR', awayTeam: 'VEN', home: 7, away: 0 },
      { homeTeam: 'URU', awayTeam: 'BOL', home: 0, away: 0 },
      { homeTeam: 'PER', awayTeam: 'COL', home: 0, away: 0 }
    ]
    const result = applyRound(INITIAL_TABLE, round)

    expect(result[2].team).toBe('ARG')
    expect(result[4].team).toBe('COL')
    expect(result[5].team).toBe('PER')
  })
})

describe('statusFor', () => {
  it('properly gives the status of each team', () => {
    expect(statusFor('ARG', INITIAL_TABLE)).toBe('E')
    expect(statusFor('CHI', INITIAL_TABLE)).toBe('C')
    expect(statusFor('PER', INITIAL_TABLE)).toBe('R')
  })
})

describe('scenariosFor', () => {
  const startupRound = [
    { homeTeam: 'ECU', awayTeam: 'ARG', home: 0, away: 0 },
    { homeTeam: 'BRA', awayTeam: 'CHI', home: 0, away: 0 },
    { homeTeam: 'PAR', awayTeam: 'VEN', home: 0, away: 0 },
    { homeTeam: 'URU', awayTeam: 'BOL', home: 0, away: 0 },
    { homeTeam: 'PER', awayTeam: 'COL', home: 0, away: 0 }
  ]

  it('gives no scenario if already on the target situation', () => {
    expect(scenariosFor(INITIAL_TABLE, startupRound, 'ARG', 'E')).toEqual({
      target: 'E',
      distance: 0,
      alternatives: [[]]
    })
  })

  it('gives the closest scenario for the target situation', () => {
    expect(scenariosFor(INITIAL_TABLE, startupRound, 'ARG', 'C')).toEqual({
      target: 'C',
      distance: 1,
      alternatives: [[{ team: 'ARG', goals: 1 }]]
    })
    expect(scenariosFor(INITIAL_TABLE, startupRound, 'ARG', 'R')).toEqual({
      target: 'R',
      distance: 1,
      alternatives: [[{ team: 'COL', goals: 1 }]]
    })
  })

  it('removes duplicated scenarios', () => {
    const round = [
      { homeTeam: 'ECU', awayTeam: 'ARG', home: 0, away: 1 },
      { homeTeam: 'BRA', awayTeam: 'CHI', home: 0, away: 0 },
      { homeTeam: 'PAR', awayTeam: 'VEN', home: 0, away: 0 },
      { homeTeam: 'URU', awayTeam: 'BOL', home: 0, away: 0 },
      { homeTeam: 'PER', awayTeam: 'COL', home: 0, away: 0 }
    ]
    const result = scenariosFor(INITIAL_TABLE, round, 'ARG', 'R')
    expect(result.alternatives).toHaveLength(3)
  })
})
