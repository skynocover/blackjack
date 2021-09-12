import React from "react";
import * as antd from "antd";
import swal from "sweetalert";
import { AppContext, double, roundbet } from "../AppContext";
import { cardnumCalc } from "../utils/cardnum";

interface ControlPanelProps {}

const ControlPanel = ({}: ControlPanelProps) => {
  const appCtx = React.useContext(AppContext);

  const end = (context: any) => {
    const { playerNum, dealerNum, bet, blackjack } = context;
    let swalConfig: any = {};
    if (playerNum > 21) {
      swalConfig = {
        title: "Dealer Win",
        text: `Player Bust: ${playerNum}`,
      };
    } else if (dealerNum > 21) {
      swalConfig = {
        title: "Player Win",
        text: `Dealer Bust: ${dealerNum}`,
      };
    } else if (dealerNum > playerNum) {
      swalConfig = {
        title: "Dealer Win",
        text: `Dealer: ${dealerNum},Player: ${playerNum}`,
      };
    } else if (playerNum > dealerNum) {
      swalConfig = {
        title: "Player Win",
        text: `Dealer: ${dealerNum},Player: ${playerNum}`,
      };
    } else {
      swalConfig = {
        title: "Push",
        text: `Dealer: ${dealerNum},Player: ${playerNum}`,
      };
    }
    if (swalConfig.title === "Player Win") {
      if (blackjack) {
        appCtx.setBank((prevState) => prevState + bet * 2.5);
      } else {
        appCtx.setBank((prevState) => prevState + bet * 2);
      }
    } else if (swalConfig.title === "Push") {
      appCtx.setBank((prevState) => prevState + bet);
    }
    swal(swalConfig).then(() => {
      appCtx.sendMachineState("NextRound");
    });
  };

  const Hit = () => {
    const { changed, context } = appCtx.sendMachineState("Hit");
    if (changed && context.num > 21) {
      const { context } = appCtx.sendMachineState("Stand");
      end(context);
    }
  };

  const Stand = () => {
    const { changed, context } = appCtx.sendMachineState("Stand");
    if (changed) end(context);
  };

  const Double = () => {
    const { changed, context } = appCtx.sendMachineState("Double");
    if (changed) end(context);
  };

  return (
    <div className="row justify-content-around ">
      <div className="col d-flex justify-content-center">
        <antd.Button type="primary" onClick={Hit}>
          Hit
        </antd.Button>
      </div>
      <div className="col d-flex justify-content-center">
        {appCtx.playerCards.length === 2 &&
        appCtx.bank > roundbet &&
        cardnumCalc(appCtx.playerCards) === 11 ? (
          <antd.Button type="primary" onClick={Double}>
            Double
          </antd.Button>
        ) : (
          <antd.Button type="dashed" disabled={true}>
            Double
          </antd.Button>
        )}
        {double && <span className="ml-2">{roundbet}</span>}
      </div>
      <div className="col d-flex justify-content-center">
        <antd.Button type="primary" onClick={Stand}>
          Stand
        </antd.Button>
      </div>
    </div>
  );
};

export { ControlPanel };
