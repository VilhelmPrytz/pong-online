import React from 'react';
import { useState, useLayoutEffect, useEffect } from 'react';
import styled from 'styled-components';

const Board = styled.canvas`
    background-color: gray;
    margin: auto;
    padding: 0px;
    display: block;
`

function drawPlayers(ctx, locations) {
    ctx.fillStyle = 'yellow';
    console.log(locations)

    ctx.fillRect(0, locations[0], 20, 80);
    ctx.fillRect(980, locations[1], 20, 80);
}

function drawBall(ctx, location) {
    ctx.fillStyle = 'red';
    console.log(location)

    ctx.fillRect(location.x, location.y, 20, 20);
}

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
    const canvasRef = React.useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        drawPlayers(ctx, [props.player_one_y, props.player_two_y])
        drawBall(ctx, {x: props.ball_x, y: props.ball_y})
    }, [])

    return (
        <Board
            width={1000} height={500}
            ref={canvasRef}
        />
    )
}

export default Game;