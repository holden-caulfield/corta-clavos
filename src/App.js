import React, { Component } from 'react'
import './App.css'
import Status from 'Sections/Status'
import Round from 'Sections/Round'
import Table from 'Sections/Table'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Status />
        <div>
          <Round />
          <Table />
        </div>
      </div>
    )
  }
}

export default App
