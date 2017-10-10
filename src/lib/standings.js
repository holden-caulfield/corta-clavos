// @flow
import {
  sortWith,
  descend,
  prop,
  propEq,
  findIndex,
  zip,
  times,
  range,
  repeat,
  remove,
  reduceWhile,
  none,
  compose,
  uniq,
  chain
} from 'ramda'

declare type StandingsEntry = {
  team: string,
  pts: number,
  gf: number,
  ga: number
}
declare type Standings = Array<StandingsEntry>

declare type Game = {
  homeTeam: string,
  awayTeam: string,
  home: number,
  away: number
}
declare type Round = Array<Game>

declare type Scenario = Array<{
  team: string,
  goals: number
}>

declare type ScenarioSet = {
  distance: number,
  target: string,
  alternatives: Array<Scenario>
}

export const INITIAL_TABLE = [
  { team: 'BRA', pts: 38, gf: 38, ga: 11 },
  { team: 'URU', pts: 28, gf: 28, ga: 18 },
  { team: 'CHI', pts: 26, gf: 26, ga: 24 },
  { team: 'COL', pts: 26, gf: 20, ga: 18 },
  { team: 'PER', pts: 25, gf: 26, ga: 25 },
  { team: 'ARG', pts: 25, gf: 16, ga: 15 },
  { team: 'PAR', pts: 24, gf: 19, ga: 24 },
  { team: 'ECU', pts: 20, gf: 25, ga: 26 },
  { team: 'BOL', pts: 14, gf: 14, ga: 34 },
  { team: 'VEN', pts: 9, gf: 18, ga: 35 }
]

const gameResult = game => {
  const { home, away } = game
  if (home > away) return 'HOME'
  if (away > home) return 'AWAY'
  return 'TIE'
}

const gameParticipation = (game, team) => {
  const { homeTeam, awayTeam } = game
  if (team === homeTeam) return 'HOME'
  if (team === awayTeam) return 'AWAY'
  return false
}

const pointsForTeam = (game, team) => {
  const teamInGame = gameParticipation(game, team)
  const result = gameResult(game)
  if (!teamInGame) return 0
  if (teamInGame === result) return 3
  if (result === 'TIE') return 1
  return 0
}

const goalsForTeam = (game, team, against = false) => {
  const checkFor = against ? 'AWAY' : 'HOME'
  const teamInGame = gameParticipation(game, team)
  if (!teamInGame) return 0
  return teamInGame === checkFor ? game.home : game.away
}

const applyGame = (game, standings) =>
  standings.map(entry => ({
    team: entry.team,
    pts: entry.pts + pointsForTeam(game, entry.team),
    gf: entry.gf + goalsForTeam(game, entry.team),
    ga: entry.ga + goalsForTeam(game, entry.team, true)
  }))

const sortStandings = sortWith([
  descend(prop('pts')),
  descend(entry => entry.gf - entry.ga),
  descend(prop('gf'))
])

export const applyRound = (standings: Standings, round: Round) =>
  sortStandings(
    round.reduce((current, game) => applyGame(game, current), standings)
  )

export const statusFor = (team: string, standings: Standings) => {
  const pos = findIndex(propEq('team', team), standings)
  if (pos < 4) return 'C'
  else if (pos === 4) return 'R'
  else return 'E'
}

const nextSteps = rounds => {
  const possibleGoals = len =>
    zip(times(i => i % len, len * 2), [
      ...repeat('HOME', len),
      ...repeat('AWAY', len)
    ])
  const applyGoal = round => ([index, who]) => [
    ...remove(index, 1, round),
    {
      ...round[index],
      home: round[index].home + (who === 'HOME' ? 1 : 0),
      away: round[index].away + (who === 'AWAY' ? 1 : 0)
    }
  ]
  return chain(
    round => possibleGoals(round.length).map(applyGoal(round)),
    rounds
  )
}

const toTeamGoals = compose(
  sortWith([descend(prop('team'))]),
  chain(game => [
    { team: game.homeTeam, goals: game.home },
    { team: game.awayTeam, goals: game.away }
  ])
)

const scenarioFrom = roundFrom => roundTo =>
  zip(toTeamGoals(roundTo), toTeamGoals(roundFrom))
    .map(([now, before]) => ({
      team: before.team,
      goals: now.goals - before.goals
    }))
    .filter(item => item.goals > 0)

export const scenariosFor = (
  standings: Standings,
  round: Round,
  team: string,
  target: string
): ScenarioSet => {
  const meetsTarget = round =>
    statusFor(team, applyRound(standings, round)) === target
  const { distance, rounds } = reduceWhile(
    ({ rounds }) => none(meetsTarget, rounds),
    ({ _, rounds }, step) => ({ distance: step, rounds: nextSteps(rounds) }),
    { distance: 0, rounds: [round] },
    range(1, 4)
  )
  return {
    target,
    distance,
    alternatives: uniq(rounds.filter(meetsTarget).map(scenarioFrom(round)))
  }
}
