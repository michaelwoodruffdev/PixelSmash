import React from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';

function Dashboard() {
  const trump = {
    spritesheetPath: 'assets/trumpsprite.png',
    spriteSheetAnimations: [
      {
        key: 'left',
        frames: { start: 18, end: 23 },
        frameRate: 10,
        repeat: -1
      }, 
      {
        key: 'right',
        frames: { start: 6, end: 1 },
        frameRate: 10,
        repeat: -1
      }, 
      {
        key: 'idle',
        frames: { start: 4, end: 5 },
        frameRate: 3,
        repeat: -1
      }
    ],
    movementSpeed: 400,
    frameDimensions: {
      x: 100,
      y: 100
    },
    hitboxDimensions: {
      x: 30,
      y: 70
    },
    jumpHeights: {
      first: 80,
      second: 40
    },
    mass: 200
  }

  return (
    <div className="Dashboard">
      <Game player1Prop={trump} />
    </div>
  );
}

export default Dashboard;