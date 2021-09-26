import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';
import { SuitSpadeFill } from 'react-bootstrap-icons';

import { Notification } from '../components/Notification';
import { Cards } from '../block/Cards';
import { ControlPanel } from '../block/ControlPanel';
import { BankPanel } from '../block/BankPanel';
import { Card } from '../class/Card';
import { MenuPlayer, player } from '../block/MenuPlayer';
import swal from 'sweetalert';
import { cardnumCalc } from '../utils/cardnum';
import { Player } from '../class/Player';

const GamePage = () => {
  const appCtx = React.useContext(AppContext);
  const [players, setPlayers] = React.useState<player[]>([]);
  // const [pendingPlayers, setPendingPlayers] = React.useState<player[]>([]);

  const [dealerCards, setDealerCards] = React.useState<Card[]>([]);
  const [playerCards, setPlayerCards] = React.useState<Card[]>([]);
  const [splitCard, setSplitCard] = React.useState<Card[]>([]);
  const [bank, setBank] = React.useState<number>(0);
  const [bet, setBet] = React.useState<number>(0);
  const [minBet, setMinBet] = React.useState<number>(0);
  const [deckCardNumber, setDeckCardNumber] = React.useState<number>(52);

  React.useEffect(() => {
    if (!appCtx.room || !appCtx.room.state) {
      window.location.href = '/#/lobby';
      return;
    }

    appCtx.room.onStateChange((state) => {
      const { players, pendingPlayers, dealerHandCard, deck } = state;
      setPlayers([...players, ...pendingPlayers]);
      // setPendingPlayers([...pendingPlayers]);
      setDealerCards(dealerHandCard);
      const p = players.filter((item: any) => item.name === appCtx.name);
      if (p[0]) {
        if (
          p[0].handCard.length === 2 &&
          cardnumCalc(p[0].handCard) === 21 &&
          p[0].splitCard.length === 0
        ) {
          Notification.add('success', 'Black Jack');
        }
        setPlayerCards(p[0].handCard);
        setSplitCard(p[0].splitCard);
      }

      setDeckCardNumber(deck.cards.length);
    });

    appCtx.room.onMessage('AllDeal', (data) => appCtx.sendMachineState('AllDeal'));

    appCtx.room.onMessage('Bank', (data) => setBank(data));
    appCtx.room.onMessage('Bet', (data) => setBet(data));
    appCtx.room.onMessage('minBet', (data) => setMinBet(data));
    appCtx.room.onMessage('playerJoin', (data) =>
      Notification.add('success', `${data} join this room`),
    );

    appCtx.room.onMessage('Start', (data) => {
      const { shuffle } = data;
      if (shuffle) Notification.add('success', 'shuffle decks');

      setDealerCards([]);
      setPlayerCards([]);
      setSplitCard([]);
      const temp = players.map((p) => {
        p.handCard = [];
        return p;
      });
      setPlayers([...temp]);
      appCtx.sendMachineState('Start', { shuffle: false });
    });

    appCtx.room.onMessage('End', async (data) => {
      appCtx.sendMachineState('End');
      const { players, dealerHandCard } = data;
      setDealerCards(dealerHandCard);

      const dealNum = cardnumCalc(dealerHandCard);
      const p = players.filter((p: any) => p.name === appCtx.name);
      if (p[0]) {
        const { title, text } = Swal(dealNum, p[0].handCard);
        await swal(title, text);
        if (p[0].splitCard.length !== 0) {
          const { title, text } = Swal(dealNum, p[0].splitCard);
          await swal(title, text);
        }
        appCtx.room?.send('CheckOut');
      }
    });
  }, []);

  const leaveRoom = async () => {
    appCtx.room?.leave();
    appCtx.setRoom(undefined);
    appCtx.sendMachineState('ReStart');
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
          <span className="mx-2">Bank: {bank}</span>
          <span>Cards: {deckCardNumber}</span>
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
      <antd.Layout.Sider
        width={200}
        className="site-layout-background"
        style={{ backgroundColor: '#60A5FA' }}
      >
        {players.map((player) => (
          <MenuPlayer
            handCard={player.handCard}
            splitCard={player.splitCard}
            name={player.name}
            state={player.state}
            bet={player.bet}
          />
        ))}
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
          <Cards cards={dealerCards} />
          <ControlPanel playerCards={playerCards} bank={bank} bet={bet} />
          <Cards cards={playerCards} splitCard={splitCard} />
          <BankPanel bank={bank} minBet={minBet} />
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

interface swalConfig {
  title: string;
  text: string;
}

const Swal = (dealNum: number, handCard: Card[]): swalConfig => {
  const playerNum = cardnumCalc(handCard);
  if (playerNum > 21) {
    return { title: 'Dealer Win', text: `Player Bust: ${playerNum}` };
  } else if (dealNum > 21) {
    return { title: 'Player Win', text: `Dealer Bust: ${dealNum}` };
  } else if (dealNum > playerNum) {
    return { title: 'Dealer Win', text: `Dealer: ${dealNum},Player: ${playerNum}` };
  } else if (playerNum > dealNum) {
    return { title: 'Player Win', text: `Dealer: ${dealNum},Player: ${playerNum}` };
  } else {
    return { title: 'Push', text: `Dealer: ${dealNum},Player: ${playerNum}` };
  }
};

export { GamePage };
