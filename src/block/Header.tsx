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
      className="d-flex align-items-center px-3 bg-white shadow-sm"
      style={{ zIndex: 1 }}
    >
      <div>
        <SuitSpadeFill />
        <span className="ml-2">Black Jack</span>
      </div>

      <div className="flex-fill" />
      <div>
        <span className="ml-2">Decks : {decks} </span>
        <span className="ml-2">Deck cards: {appCtx.deckCardNumber}</span>
      </div>
      <antd.Popover
        placement="bottom"
        content={
          <div className="d-flex flex-column">
            <antd.Button
              type="link"
              danger
              onClick={() => appCtx.setModal(<SetDecks />)}
            >
              SetDecks
            </antd.Button>
            <antd.Button type="link" danger onClick={() => appCtx.logout()}>
              CheckOut
            </antd.Button>
          </div>
        }
      >
        <antd.Button type="link">Menu</antd.Button>
      </antd.Popover>
    </antd.Layout.Header>
  );
};

export { Header };
