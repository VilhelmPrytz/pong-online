import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

import Game from './components/Game/index';
import useKey from './components/useKey/index';

// game states
// 0 - menu
// 1 - waiting for opponent to join
// 2 - in game

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
      }
  }
}

function App() {
  const [gameState, setGameState] = useState("0");
  const [sessionToken, setSessionToken] = useState("");
  const [inviteKey, setInviteKey] = useState(false);

  const [ballX, setBallX] = useState("490");
  const [ballY, setBallY] = useState("240");
  const [playerOneY, setPlayerOneY] = useState("210");
  const [playerTwoY, setPlayerTwoY] = useState("210");

  const up = useKey("ArrowUp");
  const down = useKey("ArrowDown");

  // get game data
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
          throw new Error("Unable to communicate with backend server.");
        } else {
          // other errors are handled by json
          return response.json();
        }
      }
    })
    .then(json => {
      if (json.http_code === 200) {
        setBallX(json.response.game.ball_x)
        setBallY(json.response.game.ball_y)
        setPlayerOneY(json.response.game.p1_pos)
        setPlayerTwoY(json.response.game.p2_pos)
        setGameState(`${json.response.game.state}`)
      } else {
        console.log(json)
        throw new Error("Unable to communicate with backend server.")
      }
    });
  }

  // create new game
  const newGame = () => {
    fetch(`http://localhost:5000/backend/board`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Unable to communicate with backend server.")
      }
    })
    .then(json => {
      if (json.http_code === 201) {
        setSessionToken(json.response.game.your_key)
        setInviteKey(json.response.game.invite_key)
        setGameState("1")

        console.log(json)
        console.log("Joined game")
      } else {
        throw new Error("Could not create game")
      }
    })
  }

  // join
  const joinKey = getQueryVariable("join");
  useEffect(() => {
    if (joinKey) {
      console.log("Joining existing game as player 2")
      fetch(`http://localhost:5000/backend/board/join`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          invite_key: joinKey
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to communicate with backend server.")
        }
      })
      .then(json => {
        if (json.http_code === 200) {
          setSessionToken(json.response.game.your_key)
          setGameState("2")
  
          console.log(json)
          console.log("Joined game")
        } else {
          throw new Error("Could not join game")
        }
      })

    }
  }, [joinKey])

  // update 20 times a second
  useEffect(() => {
    if (gameState === "1") {
      const interval = setInterval(() => {
        getData();
      }, 500); // 50 is 20 times a second
      return () => clearInterval(interval);
    } else if (gameState === "2") {
      const interval = setInterval(() => {
        setInviteKey(false);
        getData();
      }, 50); // 50 is 20 times a second
      return () => clearInterval(interval);
    }

  }, [gameState]);

  // catch up and down
  useEffect(() => {
    let direction;
    if (up) {
      direction = "up"
    } else if (down) {
      direction = "down"
    }

    if (up || down) {
      fetch(`http://localhost:5000/backend/board/move`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: sessionToken,
          direction: direction
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to communicate with backend server.")
        }
      })
      .then(json => {
        if (json.http_code === 200) {
          setSessionToken(json.response.game.your_key)
          setGameState("2")
  
          console.log(json)
          console.log("Joined game")
        } else {
          throw new Error("Could not join game")
        }
      })
    }
  }, [up, down])

  return (
    <div className="App">
      <h1>Pong Online</h1>
      {gameState === "0" &&
        <button onClick={newGame}>Start Game</button>
      }
      {inviteKey &&
        <p>Invite another player by sending them this link:
          <a href={`https://pong.vilhelmprytz.se/?join=${inviteKey}`}>{`https://pong.vilhelmprytz.se/?join=${inviteKey}`}</a>
        </p>
      }

      <Game
        player_one_y={playerOneY}
        player_two_y={playerTwoY}
        ball_x={ballX}
        ball_y={ballY}
      />
    </div>
  );
}

export default App;
