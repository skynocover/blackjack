import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as antd from "antd";
import { AppContext } from "./AppContext";

import { Cards } from "./block/Cards";
import { ControlPanel } from "./block/ControlPanel";
import { BankPanel } from "./block/BankPanel";
import { Header } from "./block/Header";

function App() {
  const appCtx = React.useContext(AppContext);

  return (
    <antd.Layout className="bg-white">
      <Header />
      <antd.Layout.Content style={{ overflow: "auto" }}>
        <div className="container">
          <Cards cards={appCtx.dealerCards} />
          <ControlPanel />
          <Cards cards={appCtx.playerCards} />
          <BankPanel />
        </div>
      </antd.Layout.Content>
    </antd.Layout>
  );
}

export default App;
// Bust
// Split
// Stand
// Hit
// Double
// Dealer
