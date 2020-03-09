import React from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';
import teststage from '../../stageConfigs/teststage.js';

function Dashboard() {
  return (
    <div className="Dashboard">
      <Game playerConfigs={[billnbob, dhonu]} stageConfig={teststage}/>
    </div>
  );
}

export default Dashboard;