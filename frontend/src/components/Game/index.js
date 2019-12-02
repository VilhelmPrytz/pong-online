import React from 'react';
import { useState, useLayoutEffect } from 'react';
import styled from 'styled-components';

const Board = styled.div`
    width: 1000px;
    height: 500px;
    background-color: gray;
    margin: auto;
    padding: 0px;
`

const Player = styled.div`
    width: 20px;
    height: 60px;
    background-color: cyan;
    position: absolute;
`

const Ball = styled.div`
    height: 15px;
    width: 15px;
    background-color: darkred;
    position: absolute;
`

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
  }

function Game(props) {
    const [screenWidth, screenHeight] = useWindowSize();

    return (
        <Board>
            <Player style={{
                top: screenHeight-500+props.player_one_x,
                left: (screenWidth-1000)/2
            }}/>
            
            <Player style={{
                top: screenHeight-500+props.player_two_x,
                left: (screenWidth-1000)/2+980
            }}/>
            
            <Ball style={{
                top: screenHeight-500+props.ball_x,
                left: (screenWidth-1000)/2+props.ball_y
            }}/>
        </Board>
    )
}

export default Game;