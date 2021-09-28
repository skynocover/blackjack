import React from 'react';
import * as antd from 'antd';
import { AppContext } from '../AppContext';
import { cardnumCalc } from '../utils/cardnum';
import { Card } from '../class/Card';
interface ControlPanelProps {
  doubleAt11: boolean;
  out: boolean;
  playerCards: Card[];
  bet: number;
  bank: number;
}

const ControlPanel = ({ doubleAt11, out, playerCards, bet, bank }: ControlPanelProps) => {
  const appCtx = React.useContext(AppContext);

  const Hit = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Hit');
    appCtx.sendMachineState('Hit');
  };

  const Stand = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Stand');
    appCtx.sendMachineState('Stand');
  };

  const Double = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Double');
    appCtx.sendMachineState('Stand');
  };

  const Split = () => {
    if (!appCtx.room) return;
    appCtx.room.send('Split');
    appCtx.sendMachineState('Split');
  };

  return (
    <div className="row justify-content-around ">
      <div className="col d-flex justify-content-center">
        <antd.Button
          type="primary"
          onClick={Hit}
          disabled={
            out ||
            (appCtx.machineState.value !== 'deal' &&
              appCtx.machineState.value !== 'hit' &&
              appCtx.machineState.value !== 'split')
          }
        >
          Hit
        </antd.Button>
      </div>
      <div className="col d-flex justify-content-center">
        <antd.Button
          type="primary"
          onClick={Double}
          disabled={
            doubleAt11
              ? !(
                  playerCards.length === 2 &&
                  bank >= bet &&
                  appCtx.machineState.value === 'deal' &&
                  cardnumCalc(playerCards) === 11
                )
              : playerCards.length !== 2 || bank < bet || appCtx.machineState.value !== 'deal'
          }
        >
          Double
        </antd.Button>
      </div>
      <div className="col d-flex justify-content-center">
        <div className="mx-2">
          <antd.Button
            type="primary"
            onClick={Stand}
            disabled={
              out ||
              (appCtx.machineState.value !== 'deal' &&
                appCtx.machineState.value !== 'hit' &&
                appCtx.machineState.value !== 'split')
            }
          >
            Stand
          </antd.Button>
        </div>
        {appCtx.machineState.value === 'deal' &&
          playerCards.length === 2 &&
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
