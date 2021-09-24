import React from 'react';
import * as antd from 'antd';
import { AppContext } from '../AppContext';

const BankPanel = () => {
  const appCtx = React.useContext(AppContext);
  const [bet, setBet] = React.useState<number>(100);

  const deal = () => {
    if (!appCtx.room) return;

    appCtx.room.send('Deal', { bet });
    // if (bet > appCtx.bank) return;
  };

  const gameStart = () => {
    if (!appCtx.room) {
      window.location.href = '/#/lobby';
      return;
    }
    appCtx.room.send('Start');
  };

  return (
    <div className="row justify-content-center">
      {appCtx.machineState.value === 'beforeStart' ? (
        <div className="col-6 d-flex justify-content-center">
          <antd.Button type="primary" onClick={gameStart}>
            Start
          </antd.Button>
        </div>
      ) : (
        <div className="col-6 d-flex justify-content-center">
          <antd.Button
            type="primary"
            disabled={appCtx.machineState.value !== 'start'}
            onClick={deal}
          >
            Deal
          </antd.Button>
          <antd.InputNumber
            // max={appCtx.bank}
            min={0}
            defaultValue={100}
            onChange={(value) => setBet(value)}
          />
        </div>
      )}
    </div>
  );
};

export { BankPanel };
