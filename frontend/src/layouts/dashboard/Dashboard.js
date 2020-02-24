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

  const dhonu = {
    spritesheetPath: 'assets/dhonu.png',
    spriteSheetAnimations: [
      {
        key: 'left',
        frames: { start: 0, end: 6 },
        frameRate: 10,
        repeat: -1
      }, 
      {
        key: 'right',
        frames: { start: 0, end: 6 },
        frameRate: 10,
        repeat: -1
      }, 
      {
        key: 'idle',
        frames: { start: 7, end: 10 },
        frameRate: 3,
        repeat: -1
      }
    ],
    movementSpeed: 400,
    frameDimensions: {
      x: 206,
      y: 206
    },
    hitboxDimensions: {
      x: 118,
      y: 80
    },
    jumpHeights: {
      first: -700,
      second: -350
    },
    mass: 200
  }

  const billnbob = {
    spritesheetPath: 'assets/billnbob.png',
    spriteSheetAnimations: [
      {
        key: 'left',
        frames: { start: 5, end: 8 },
        frameRate: 10,
        repeat: -1
      }, 
      {
        key: 'right',
        frames: { start: 5, end: 8 },
        frameRate: 10,
        repeat: -1
      }, 
      {
        key: 'idle',
        frames: { start: 0, end: 8 },
        frameRate: 7,
        repeat: -1
      }, 
      {
        key: 'jump', 
        frames: { start: 9, end: 15 }, 
        frameRate: 15, 
        repeat: -1
      }
    ],
    movementSpeed: 400,
    frameDimensions: {
      x: 192,
      y: 192
    },
    hitboxDimensions: {
      x: 80,
      y: 95
    },
    jumpHeights: {
      first: -450,
      second: -450
    },
    mass: 200, 
    scale: .6
  }

  return (
    <div className="Dashboard">
      <Game player1Prop={billnbob} />
    </div>
  );
}

export default Dashboard;