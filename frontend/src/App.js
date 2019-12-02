import React from 'react';
import { useState } from 'react';
import './App.css';

import Game from './components/Game/index';
import useKey from './components/useKey/index';

function App() {
  const up = useKey("ArrowUp");
  const down = useKey("ArrowDown");

  return (
    <div className="App">
      <h1>Pong Online</h1>
      <Game
        player_one_x="0"
        player_two_x="0"
        ball_x="200"
        ball_y="200"
      />
    </div>
  );
}

export default App;
