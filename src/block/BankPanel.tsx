import React from "react";
import * as antd from "antd";
import { AppContext } from "../AppContext";
import { Game } from "../class/Game";

const BankPanel = () => {
  const appCtx = React.useContext(AppContext);
  const [bet, setBet] = React.useState<number>(100);

  const gameStart = () => {
    console.log("bank: ", appCtx.bank);
    appCtx.setBank((prevState) => {
      return prevState - bet;
    });
    appCtx.sendMachineState("Deal", { bet });
  };

  return (
    <div className="row justify-content-around">
      <div className="col">{appCtx.bank}</div>

      {appCtx.machineState.value === "beforeStart" ? (
        <div className="col d-flex">
          <antd.Button
            type="primary"
            onClick={() => appCtx.sendMachineState("Start")}
          >
            Start
          </antd.Button>
        </div>
      ) : (
        <div className="col d-flex">
          <antd.Button type="primary" onClick={gameStart}>
            Deal
          </antd.Button>
          <antd.InputNumber
            max={appCtx.bank}
            min={0}
            defaultValue={100}
            onChange={(value) => setBet(value)}
          />
        </div>
      )}

      <div className="col">
        <antd.Button
          type="primary"
          onClick={() => appCtx.sendMachineState("ReStart")}
        >
          Restart
        </antd.Button>
      </div>
    </div>
  );
};

export { BankPanel };
