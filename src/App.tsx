import React from 'react';
import './App.css';
import * as antd from 'antd';
import { AppContext } from './AppContext';

import { Cards } from './block/Cards';
import { ControlPanel } from './block/ControlPanel';
import { BankPanel } from './block/BankPanel';
import { Header } from './block/Header';

function App() {
  const appCtx = React.useContext(AppContext);

  return (
    <antd.Layout className="bg-white vh-100">
      <Header />
      <antd.Layout.Content
        className="bg-image"
        style={{
          overflow: 'auto',
          backgroundImage: `url("/assets/image/${appCtx.backgroundImage}.jpg")`,
          backgroundSize: 'cover',
        }}
      >
        <div className="container h-100">
          <Cards type={'dealer'} cards={appCtx.dealerCards} />
          <ControlPanel />
          <Cards type={'player'} cards={appCtx.playerCards} />
          <BankPanel />
        </div>
      </antd.Layout.Content>
    </antd.Layout>
  );
}

export default App;
