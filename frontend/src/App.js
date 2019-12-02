import React from 'react';
import { useState } from 'react';
import './App.css';

import Game from './components/Game/index';
import useKey from './components/useKey/index';

function App() {
  const [sessionToken, setSessionToken] = useState("");

  const up = useKey("ArrowUp");
  const down = useKey("ArrowDown");

  const getData = () => {
    fetch(`http://localhost:5000/backend/board`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: sessionToken
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 502) {
            throw new Error("Kunde inte kommunicera med server.");
          } else {
            // other errors are handled by json
            return response.json();
          }
        }
      })
      .then(json => {
        if (json.http_code === 200) {
          throw new Error("Kunde inte kommunicera med server.")
        } else {
          // do stuff
        }
      });
  }

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
