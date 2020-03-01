import React from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
// import billnbob from '../../characterObjects/billnbob.js';
// import dhonu from '../../characterObjects/dhonu.js';
// import troomp from '../../characterObjects/troomp.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';

function Dashboard() {
  return (
    <div className="Dashboard">
      <Game player1Prop={billnbob} />
    </div>
  );
}

export default Dashboard;