import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';
import swal from 'sweetalert';
import { SuitSpadeFill } from 'react-bootstrap-icons';

import { Notification } from '../components/Notification';
import { Cards } from '../block/Cards';
import { ControlPanel } from '../block/ControlPanel';
import { BankPanel } from '../block/BankPanel';
import { Card } from '../class/Card';
import { MenuPlayer, player } from '../block/MenuPlayer';
import { cardnumCalc } from '../utils/cardnum';
import { Menu } from '../modals/Menu';

const GamePage = () => {
  const appCtx = React.useContext(AppContext);

  const [bank, setBank] = React.useState<number>(0);
  const [bet, setBet] = React.useState<number>(0);
  const [minBet, setMinBet] = React.useState<number>(0);
  const [deckCardNumber, setDeckCardNumber] = React.useState<number>(52);
  const [out, setOut] = React.useState<boolean>(false);
  const [doubleAt11, setDoubleAt11] = React.useState<boolean>(false);
  const [H17, setH17] = React.useState<boolean>(false);
  const [blackjackPay, setBlackjackPay] = React.useState<number>(0);

  const [players, setPlayers] = React.useState<player[]>([]);
  const [dealerCards, setDealerCards] = React.useState<Card[]>([]);
  const [playerCards, setPlayerCards] = React.useState<Card[]>([]);
  const [splitCard, setSplitCard] = React.useState<Card[]>([]);

  React.useEffect(() => {
    if (!appCtx.room || !appCtx.room.state) {
      window.location.href = '/#/lobby';
      return;
    }

    appCtx.room.onStateChange((state) => {
      const { players, pendingPlayers, outPlayers, dealerHandCard, deck } = state;
      setPlayers([...players, ...pendingPlayers, ...outPlayers]);
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

    appCtx.room.onMessage('AllDeal', () => appCtx.sendMachineState('AllDeal'));

    appCtx.room.onMessage('Bank', (data) => setBank(data));
    appCtx.room.onMessage('Bet', (data) => setBet(data));

    appCtx.room.onMessage('Info', (data) => {
      const { Bank, minBet, doubleAt11, H17, blackjackPay } = data;
      setBank(Bank);
      setMinBet(minBet);
      setDoubleAt11(doubleAt11);
      setH17(H17);
      setBlackjackPay(blackjackPay);
    });

    appCtx.room.onMessage('Out', () => {
      setOut(true);
      setBank(0);
      swal('out', 'Bank has become zero');
    });
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

  const Header = () => {
    return (
      <antd.Layout.Header
        className="d-flex justify-content-between px-3 bg-white shadow-sm"
        style={{ zIndex: 1 }}
      >
        <div className="col-4">
          <SuitSpadeFill />
          <span className="mx-2 ">Black Jack</span>
        </div>
        <div className="col-4 d-flex justify-content-center">
          <span className="mx-2">Bank: {bank}</span>
          <span>Cards: {deckCardNumber}</span>
        </div>
        <div className="col-4 d-flex justify-content-end align-items-center">
          <antd.Button
            type="link"
            onClick={() => {
              appCtx.setModal(
                <Menu
                  minBet={minBet}
                  doubleAt11={doubleAt11}
                  H17={H17}
                  blackjackPay={blackjackPay}
                />,
              );
            }}
          >
            Menu
          </antd.Button>
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
          <ControlPanel
            doubleAt11={doubleAt11}
            out={out}
            playerCards={playerCards}
            bank={bank}
            bet={bet}
          />
          <Cards cards={playerCards} splitCard={splitCard} />
          <BankPanel out={out} bank={bank} minBet={minBet} />
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
