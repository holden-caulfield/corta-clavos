import React from 'react'
import { connect } from 'react-redux'
import { applyRound, INITIAL_TABLE } from 'lib/standings'
import './Table.css'

const classForPosition = pos => {
  if (pos < 4) return 'qualify'
  else if (pos === 4) return 'playoff'
  else return 'eliminated'
}

const Table = ({ standings }) => (
  <section>
    <table>
      <thead>
        <tr>
          <th className="primary">Equipo</th>
          <th>PTS</th>
          <th>DIF</th>
          <th>GF</th>
          <th>GC</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((entry, index) => (
          <tr key={entry.team} className={classForPosition(index)}>
            <td>{entry.team}</td>
            <td>{entry.pts}</td>
            <td>{entry.gf - entry.ga}</td>
            <td>{entry.gf}</td>
            <td>{entry.ga}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
)

const mapStateToProps = state => ({
  standings: applyRound(INITIAL_TABLE, state.round)
})

export default connect(mapStateToProps)(Table)
