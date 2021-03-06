import React from 'react';
import * as antd from 'antd';
import { createMachine, EventData, State } from 'xstate';
import { Game } from './class/Game';
import { Card } from './class/Card';
import { Notification } from './components/Notification';
import { useMachine } from '@xstate/react';
import { cardnumCalc } from './utils/cardnum';

interface AppContextProps {
  loginPage: string;
  homePage: string;
  setModal: (modal: React.ReactNode | null, width?: number) => void;

  account: string;
  setAccount: (value: string) => void;

  fetch: (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    param?: any,
  ) => Promise<any>;

  login: (account: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  redirect: () => Promise<void>;

  machineState: State<
    any,
    any,
    any,
    {
      value: any;
      context: any;
    }
  >;
  sendMachineState: (
    event: any,
    payload?: EventData | undefined,
  ) => State<
    any,
    any,
    any,
    {
      value: any;
      context: any;
    }
  >;

  dealerCards: Card[];
  playerCards: Card[];
  deckCardNumber: number;
  bank: number;
  roundbet: number;

  splitCard: Card[];
  setSplitCard: React.Dispatch<React.SetStateAction<Card[]>>;

  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;

  decks: number;
  setDecks: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

export let game = new Game();

const AppProvider = ({ children }: AppProviderProps) => {
  const [loginPage] = React.useState('/#/login');
  const [homePage] = React.useState('/#/global');
  const [modal, setModal] = React.useState<any>(null);
  const [modalWidth, setModalWidth] = React.useState<number>(416);

  const [account, setAccount] = React.useState('');

  const [roundbet, setRoundbet] = React.useState<number>(0);
  const [deckCardNumber, setDeckCardNumber] = React.useState<number>(52);
  const [decks, setDecks] = React.useState<number>(1);
  const [bank, setBank] = React.useState<number>(1000);
  const [backgroundImage, setBackgroundImage] = React.useState<string>('bg1');

  const [splitCard, setSplitCard] = React.useState<Card[]>([]);

  const [dealerCards, setDealerCards] = React.useState<Card[]>([]);
  const [playerCards, setPlayerCards] = React.useState<Card[]>([]);

  const setInfo = () => {
    const { bank, decks, dealerCards, playerCards, deckCardNumber, splitCard } = game.info();
    setBank(bank);
    setDecks(decks);
    setDealerCards(dealerCards);
    setPlayerCards(playerCards);
    setDeckCardNumber(deckCardNumber);
    setSplitCard(splitCard);

    return { dealerCards, playerCards };
  };

  const machine = createMachine(
    {
      id: 'game',
      initial: 'beforeStart',
      context: {},
      states: {
        beforeStart: {
          on: { Start: 'start' },
          onEntry: (state, context) => {
            game = new Game();
            setInfo();
            setDeckCardNumber(decks * 52);
          },
        },
        start: {
          on: {
            ReStart: 'beforeStart',
            Deal: 'deal',
          },
          onEntry: (context: any, event: any) => {
            setInfo();
            if (event.shuffle) {
              antd.notification.success({
                message: 'Shuffle Decks',
                duration: 1,
              });
              setDeckCardNumber(decks * 52);
            }
          },
        },
        deal: {
          on: {
            ReStart: 'beforeStart',
            Hit: { target: 'hit', actions: ['hit'] },
            Double: { target: 'end', actions: ['double', 'end'] },
            End: { target: 'end', actions: ['end'] },
            Split: { target: 'split', actions: ['split'] },
          },
          onEntry: (context: any, event: any) => {
            const { bet } = event;
            setRoundbet(bet);
            const { playerCards } = setInfo();
            if (playerCards.length === 2 && cardnumCalc(playerCards) === 21) {
              antd.notification.success({
                message: 'Black Jack!!',
                duration: 1.5,
              });
            }
          },
        },
        split: {
          on: {
            ReStart: 'beforeStart',
            Hit: { actions: ['hit'] },
            End: { target: 'hit', actions: ['hit'] },
          },
          onEntry: (context: any, event: any) => {
            setInfo();
          },
        },
        hit: {
          on: {
            ReStart: 'beforeStart',
            Hit: { actions: ['hit'] },
            End: 'end',
          },
        },
        end: {
          on: {
            ReStart: 'beforeStart',
            NextRound: { target: 'start' },
          },
          onEntry: (context: any, event: any) => {
            setInfo();
            // setStoreCard([]);
          },
        },
      },
    },
    {
      actions: {
        hit: async (context, event) => {
          setInfo();
        },
        restart: () => {
          setDealerCards([]);
          setPlayerCards([]);
        },
      },
    },
  );

  const [machineState, sendMachineState] = useMachine(machine);

  React.useEffect(() => {
    console.log('front-end: ', machineState.value);
  }, [machineState]);
  /////////////////////////////////////////////////////

  const fetch = async (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    param?: any,
  ) => {
    let data: any = null;

    try {
      //   const response = await axios({
      //     method,
      //     url,
      //     data: param,
      //   });
      const response: any = {};
      console.log('response', response.data);

      if (response.data.errorCode === 2) {
        window.location.href = loginPage;
        return null;
      }

      if (response.data.errorCode !== 0) {
        throw new Error(response.data.errorMessage);
      }

      data = response.data;
    } catch (error: any) {
      Notification.add('error', error.message);
    }

    return data;
  };

  const login = async (account: string, password: string): Promise<any> => {
    const data = await fetch('post', `/api/account/login`, {
      account,
      password,
    });

    setAccount(account);

    if (data) {
      if (data.errorCode === 0) {
        Notification.add('success', 'Login');
        window.location.href = homePage;
      } else {
        window.location.href = loginPage;
      }
    } else {
      window.location.href = loginPage;
    }
  };

  const logout = async () => {
    await fetch('post', '/api/account/logout', {});
    window.location.href = loginPage;
  };

  const redirect = async () => {
    const data = await fetch('get', `/api/redirect`);
    if (data) {
      window.location.href = homePage;
    }
  };

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        loginPage,
        homePage,
        setModal: (modal: React.ReactNode | null, width: number = 520) => {
          setModalWidth(width);
          setModal(modal);
        },

        account,
        setAccount,

        fetch,

        login,
        logout,
        redirect,

        machineState,
        sendMachineState,

        dealerCards,
        playerCards,
        deckCardNumber,
        bank,
        roundbet,

        splitCard,
        setSplitCard,

        backgroundImage,
        setBackgroundImage,

        decks,
        setDecks,
      }}
    >
      {modal && (
        <antd.Modal
          visible={modal !== null}
          onOk={() => setModal(null)}
          onCancel={() => setModal(null)}
          footer={null}
          closable={false}
          width={modalWidth}
        >
          {modal}
        </antd.Modal>
      )}

      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
