import React from 'react'
import { connect } from 'react-redux'
import { scenariosFor, INITIAL_TABLE } from 'lib/standings'
import { sortBy, prop, head, tail, intersperse } from 'ramda'
import './Status.css'

const Status = ({ scenarios }) => {
  const currentStatuses = {
    C: 'CLASIFICAMOS',
    R: 'REPECHAJE',
    E: 'SIAMO FUORI'
  }

  const potentialStatuses = {
    C: 'IR AL MUNDIAL',
    R: 'IR AL REPECHAJE',
    E: 'QUEDAR AFUERA'
  }

  const goalsStr = goals => (goals === 1 ? '1 gol' : `${goals} goles`)

  const currentScenario = scenario => (
    <p className="scenario currentScenario">
      <p className="legend">Con estos resultados</p>
      <p>{currentStatuses[scenario.target]}</p>
    </p>
  )

  const potentialStr = scenario =>
    `A ${goalsStr(scenario.distance)} de ${potentialStatuses[scenario.target]}`

  const alternativeStr = alternative =>
    alternative
      .map(item => `${goalsStr(item.goals)} de ${item.team}`)
      .join(' - ')

  const current = head(scenarios)
  const rest = tail(scenarios)
  const separator = <p className="separator">ó</p>
  return (
    <section className="scenario">
      {currentScenario(current)}
      {rest.map((scenario, index) => (
        <p className="scenario potentialScenario" key={`potential-${index}`}>
          <p key={scenario.target}>{potentialStr(scenario)}</p>
          {intersperse(
            separator,
            scenario.alternatives.map((alternative, altindex) => (
              <p
                className="alternative"
                key={`alternative-${index}-${altindex}`}
              >
                {alternativeStr(alternative)}
              </p>
            ))
          )}
        </p>
      ))}
    </section>
  )
}

const mapStateToProps = state => ({
  scenarios: sortBy(
    prop('distance'),
    ['C', 'R', 'E'].map(target =>
      scenariosFor(INITIAL_TABLE, state.round, 'ARG', target)
    )
  )
})

export default connect(mapStateToProps)(Status)
