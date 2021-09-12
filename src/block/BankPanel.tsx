import React from "react";
import * as antd from "antd";
import { AppContext } from "../AppContext";
import { Game } from "../class/Game";

const BankPanel = () => {
  const appCtx = React.useContext(AppContext);
  const [bet, setBet] = React.useState<number>(100);

  const gameStart = () => {
    if (bet > appCtx.bank) {
      return;
    }
    appCtx.setBank((prevState) => prevState - bet);
    appCtx.sendMachineState("Deal", { bet });
  };

  return (
    <div className="row justify-content-center">
      {appCtx.machineState.value === "beforeStart" ? (
        <div className="col-6 d-flex justify-content-center">
          <antd.Button
            type="primary"
            onClick={() => appCtx.sendMachineState("Start")}
          >
            Start
          </antd.Button>
        </div>
      ) : (
        <div className="col-6 d-flex justify-content-center">
          <antd.Button
            type="primary"
            disabled={appCtx.machineState.value !== "roundStart"}
            onClick={gameStart}
          >
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
    </div>
  );
};

export { BankPanel };
