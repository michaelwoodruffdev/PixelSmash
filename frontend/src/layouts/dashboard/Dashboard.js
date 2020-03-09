import React from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';
import teststage from '../../stageConfigs/teststage.js';
import defaultControls from  '../../controlConfigs/default.js';
import wasdControls from '../../controlConfigs/wasd.js';

function Dashboard() {
  return (
    <div className="Dashboard">
      <Game playerConfigs={[billnbob, dhonu]} stageConfig={teststage} controlConfigs={[wasdControls, defaultControls]}/>
    </div>
  );
}

export default Dashboard;