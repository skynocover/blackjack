import React from "react";
import logo from "./logo.svg";
import * as antd from "antd";
import { AppContext, decks } from "../AppContext";

import { Cards } from "../block/Cards";
import { ControlPanel } from "../block/ControlPanel";
import { BankPanel } from "../block/BankPanel";
import { SetDecks } from "../modals/SetDecks";
import { ArrowRight, SuitSpadeFill } from "react-bootstrap-icons";

const Header = () => {
  const appCtx = React.useContext(AppContext);
  return (
    <antd.Layout.Header
      className="d-flex justify-content-between px-3 bg-white shadow-sm"
      style={{ zIndex: 1 }}
    >
      <div>
        <SuitSpadeFill />
        <span className="mx-2 ">Black Jack</span>
        <antd.Select
          defaultValue={"bg1"}
          onChange={(value) => appCtx.setBackgroundImage(`${value}`)}
        >
          <antd.Select.Option value={"bg1"}>backgroung1</antd.Select.Option>
          <antd.Select.Option value={"bg2"}>backgroung2</antd.Select.Option>
          <antd.Select.Option value={"bg3"}>backgroung3</antd.Select.Option>
          <antd.Select.Option value={"bg4"}>backgroung4</antd.Select.Option>
        </antd.Select>
      </div>
      <div className="col-6 d-flex justify-content-center">
        Bank: {appCtx.bank}
      </div>
      <div>
        <span className="ml-2">Decks : {decks} </span>
        <span className="ml-2">Deck cards: {appCtx.deckCardNumber}</span>

        <antd.Popover
          placement="bottom"
          content={
            <div className="d-flex flex-column">
              <antd.Button
                type="link"
                onClick={() => appCtx.setModal(<SetDecks />)}
              >
                SetDecks
              </antd.Button>
              <antd.Button
                type="link"
                onClick={() => appCtx.sendMachineState("ReStart")}
              >
                Restart
              </antd.Button>
              <antd.Button type="link" danger onClick={() => appCtx.logout()}>
                CheckOut
              </antd.Button>
            </div>
          }
        >
          <antd.Button type="link">Menu</antd.Button>
        </antd.Popover>
      </div>
    </antd.Layout.Header>
  );
};

export { Header };
