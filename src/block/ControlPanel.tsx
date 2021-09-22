import React from 'react';
import * as antd from 'antd';
import swal from 'sweetalert';
import { AppContext, game } from '../AppContext';
import { cardnumCalc } from '../utils/cardnum';

const ControlPanel = () => {
  const appCtx = React.useContext(AppContext);

  const end = async (context: any) => {
    const { swalConfig } = context;

    for (const config of swalConfig) {
      await swal(config);
    }
    const { context: context2 } = game.GameMachine.send('NextRound');
    appCtx.sendMachineState('NextRound', { shuffle: context2.shuffle });
  };

  const Hit = () => {
    const { changed, context } = game.GameMachine.send('Hit');
    if (!changed) return;

    appCtx.sendMachineState('Hit');

    if (context.num > 21) {
      const { context } = game.GameMachine.send('End');
      appCtx.sendMachineState('End');
      if (!context.split) end(context);
    }
  };

  const Stand = () => {
    const { changed, context } = game.GameMachine.send('End');
    if (!changed) return;

    appCtx.sendMachineState('End');
    if (!context.split) end(context);
  };

  const Double = () => {
    const { changed, context } = game.GameMachine.send('Double');
    if (!changed) return;

    appCtx.sendMachineState('Double');
    end(context);
  };

  const Split = () => {
    const { changed, context } = game.GameMachine.send('Split');
    if (!changed) return;

    appCtx.setSplitCard(context.card);
    appCtx.sendMachineState('Split', { card: context.card });
  };

  return (
    <div className="row justify-content-around ">
      <div className="col d-flex justify-content-center">
        <antd.Button type="primary" onClick={Hit}>
          Hit
        </antd.Button>
      </div>
      <div className="col d-flex justify-content-center">
        {appCtx.machineState.value === 'deal' &&
          appCtx.playerCards.length === 2 &&
          appCtx.bank >= appCtx.roundbet &&
          cardnumCalc(appCtx.playerCards) === 11 && (
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
        {appCtx.machineState.value === 'deal' &&
          appCtx.playerCards.length === 2 &&
          appCtx.bank >= appCtx.roundbet &&
          cardnumCalc([appCtx.playerCards[0]]) === cardnumCalc([appCtx.playerCards[1]]) && (
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
