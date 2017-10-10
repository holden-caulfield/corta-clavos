import React from 'react'
import { connect } from 'react-redux'
import Actions from 'Redux/Round'
import NumericInput from 'react-numeric-input'
import './Round.css'

const Round = ({ round, changeGoals }) => {
  const GoalInput = ({ value, game, home }) => (
    <NumericInput
      min={0}
      value={value}
      onChange={value => changeGoals(game, home, value)}
    />
  )

  return (
    <section>
      <div className="matches">
        {round.map((game, index) => (
          <p key={`game-${index}`}>
            <span className="team">{game.homeTeam}</span>
            {<GoalInput value={game.home} game={index} home={true} />}
            <span className="vs">VS</span>
            {<GoalInput value={game.away} game={index} home={false} />}
            <span className="team">{game.awayTeam}</span>
          </p>
        ))}
      </div>
    </section>
  )
}

const mapStateToProps = state => ({
  round: state.round
})

const mapActionsToProps = {
  changeGoals: Actions.changeGoals
}

export default connect(mapStateToProps, mapActionsToProps)(Round)
