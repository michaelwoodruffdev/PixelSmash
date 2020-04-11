import React from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';
import teststage from '../../stageConfigs/teststage.js';
import defaultControls from '../../controlConfigs/default.js';
import wasdControls from '../../controlConfigs/wasd.js';
import { Socket, SocketContext } from 'react-socket-io';

function Dashboard() {
  const uri = "ec2-18-222-189-77.us-east-2.compute.amazonaws.com:5000";

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