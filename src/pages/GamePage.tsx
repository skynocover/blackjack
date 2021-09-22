import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';
import { SuitSpadeFill } from 'react-bootstrap-icons';

import { Cards } from '../block/Cards';
import { ControlPanel } from '../block/ControlPanel';
import { BankPanel } from '../block/BankPanel';

interface player {
  name: string;
}

const GamePage = () => {
  const appCtx = React.useContext(AppContext);
  const [players, setPlayers] = React.useState<player[]>([]);

  React.useEffect(() => {
    setPlayers([{ name: 'aaa' }]);
    if (!appCtx.room) {
      window.location.href = '/#/lobby';
      return;
    }
    appCtx.room.send('info');
    appCtx.room.onMessage('info', (data) => {
      // console.log(data);
      setPlayers(data.players);
    });

    appCtx.room.onMessage('newPlayer', (data) => {
      appCtx.room?.send('info');
    });
  }, []);

  const leaveRoom = async () => {
    // console.log(appCtx.room)
    appCtx.room?.leave();
    window.location.href = '/#/lobby';
  };

  const Header = () => {
    return (
      <antd.Layout.Header
        className="d-flex justify-content-between px-3 bg-white shadow-sm"
        style={{ zIndex: 1 }}
      >
        <div className="col-4">
          <SuitSpadeFill />
          <span className="mx-2 ">Black Jack</span>
          <antd.Select
            defaultValue={'bg1'}
            onChange={(value) => appCtx.setBackgroundImage(`${value}`)}
          >
            <antd.Select.Option value={'bg1'}>backgroung1</antd.Select.Option>
            <antd.Select.Option value={'bg2'}>backgroung2</antd.Select.Option>
            <antd.Select.Option value={'bg3'}>backgroung3</antd.Select.Option>
            <antd.Select.Option value={'bg4'}>backgroung4</antd.Select.Option>
          </antd.Select>
        </div>
        <div className="col-4 d-flex justify-content-center">
          <span className="mx-2">Bank: {appCtx.bank}</span>
          <span>Cards: {appCtx.deckCardNumber}</span>
        </div>
        <div className="col-4 d-flex justify-content-end align-items-center">
          <antd.Popover
            placement="bottom"
            content={
              <div className="d-flex flex-column">
                <antd.Button type="link" danger onClick={leaveRoom}>
                  Leave Room
                </antd.Button>
                <antd.Button type="link" danger onClick={appCtx.logout}>
                  Logout
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

  const Sider = () => {
    return (
      <antd.Layout.Sider width={200} className="site-layout-background">
        <antd.Menu>
          {players.map((player) => {
            return (
              <antd.Menu.Item key={player.name}>
                <span className="d-flex align-items-center">
                  <span>{player.name}</span>
                </span>
              </antd.Menu.Item>
            );
          })}
        </antd.Menu>
      </antd.Layout.Sider>
    );
  };

  const Content = () => {
    return (
      <antd.Layout.Content
        className="bg-image"
        style={{
          overflow: 'auto',
          backgroundImage: `url("/assets/image/${appCtx.backgroundImage}.jpg")`,
          backgroundSize: 'cover',
        }}
      >
        <div className="container h-100">
          <Cards type={'dealer'} cards={appCtx.dealerCards} />
          <ControlPanel />
          <Cards type={'player'} cards={appCtx.playerCards} />
          <BankPanel />
        </div>
      </antd.Layout.Content>
    );
  };

  return (
    <antd.Layout className="bg-white vh-100">
      <Header />
      <antd.Layout>
        <Sider />
        <Content />
      </antd.Layout>
    </antd.Layout>
  );
};

export { GamePage };
