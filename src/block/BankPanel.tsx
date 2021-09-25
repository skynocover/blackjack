import React from 'react';
import * as antd from 'antd';
import { AppContext } from '../AppContext';

interface BankPanelProps {
  bank: number;
  minBet: number;
}

const BankPanel = ({ bank, minBet }: BankPanelProps) => {
  const appCtx = React.useContext(AppContext);
  const [bet, setBet] = React.useState<number>();

  const deal = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Deal', { bet: bet ? bet : minBet });
  };

  const gameStart = () => {
    if (!appCtx.room) return;
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
            max={bank}
            min={minBet}
            defaultValue={minBet}
            onChange={(value) => setBet(value)}
          />
        </div>
      )}
    </div>
  );
};

export { BankPanel };
