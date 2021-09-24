import React from 'react';
import * as antd from 'antd';
import { AppContext } from '../AppContext';
import { cardnumCalc } from '../utils/cardnum';
import { Card } from '../class/Card';
interface ControlPanelProps {
  playerCards: Card[];
  bet: number;
  bank: number;
}

const ControlPanel = ({ playerCards, bet, bank }: ControlPanelProps) => {
  const appCtx = React.useContext(AppContext);

  const Hit = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Hit');
    // const { changed, context } = game.GameMachine.send('Hit');
    // if (!changed) return;

    // appCtx.sendMachineState('Hit');

    // if (context.num > 21) {
    // const { context } = game.GameMachine.send('End');
    // appCtx.sendMachineState('End');
    // if (!context.split) end(context);
    // }
  };

  const Stand = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Stand');
    // const { changed, context } = game.GameMachine.send('End');
    // if (!changed) return;
    // appCtx.sendMachineState('End');
    // if (!context.split) end(context);
  };

  const Double = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Double');
    // const { changed, context } = game.GameMachine.send('Double');
    // if (!changed) return;
    // appCtx.sendMachineState('Double');
    // end(context);
  };

  const Split = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Split');
    // const { changed, context } = game.GameMachine.send('Split');
    // if (!changed) return;
    // appCtx.setSplitCard(context.card);
    // appCtx.sendMachineState('Split', { card: context.card });
  };

  return (
    <div className="row justify-content-around ">
      <div className="col d-flex justify-content-center">
        <antd.Button type="primary" onClick={Hit}>
          Hit
        </antd.Button>
      </div>
      <div className="col d-flex justify-content-center">
        {playerCards.length === 2 && bank >= bet && (
          <antd.Button type="primary" onClick={Double}>
            Double
          </antd.Button>
        )}
      </div>
      <div className="col d-flex justify-content-center">
        <div className="mx-2">
          <antd.Button type="primary" onClick={Stand}>
            Stand
          </antd.Button>
        </div>
        {playerCards.length === 2 &&
          // appCtx.machineState.value === 'deal' &&
          bank >= bet &&
          cardnumCalc([playerCards[0]]) === cardnumCalc([playerCards[1]]) && (
            <div>
              <antd.Button type="primary" onClick={Split}>
                Split
              </antd.Button>
            </div>
          )}
      </div>
    </div>
  );
};

export { ControlPanel };
