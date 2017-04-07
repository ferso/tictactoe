import React from 'react';
import './App.css';

import TicTacToe from './TicTacToe';

class App extends React.Component {
  render() {
    return (
      <div className="app">        
          <TicTacToe />
      </div>
    );
  }
}

export default App;
