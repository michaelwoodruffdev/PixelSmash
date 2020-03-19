import React from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';
import teststage from '../../stageConfigs/teststage.js';
import defaultControls from '../../controlConfigs/default.js';
import wasdControls from '../../controlConfigs/wasd.js';
import { Socket, SocketContext } from 'react-socket-io';

function Dashboard() {
  const uri = "http://localhost:8080";

  Game.contextType = SocketContext;

  return (
    <div className="Dashboard">
      <Socket uri={uri} options={{ transports: ['websocket'] }}>
        <Game playerConfigs={[billnbob, dhonu]} stageConfig={teststage} controlConfigs={[wasdControls, defaultControls]} />
      </Socket>
    </div>
  );
}

export default Dashboard;