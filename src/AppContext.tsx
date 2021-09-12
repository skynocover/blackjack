import React from "react";
import * as antd from "antd";
import {
  Interpreter,
  AnyEventObject,
  createMachine,
  interpret,
  EventData,
  State,
  send,
} from "xstate";
import swal from "sweetalert";
import { Game } from "./class/Game";
import { Card } from "./class/Card";
import { Notification } from "./components/Notification";
import { useMachine } from "@xstate/react";
import { cardnumCalc } from "./utils/cardnum";

interface AppContextProps {
  loginPage: string;
  homePage: string;
  setModal: (modal: React.ReactNode | null, width?: number) => void;

  account: string;
  setAccount: (value: string) => void;

  fetch: (
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    param?: any
  ) => Promise<any>;

  login: (account: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  redirect: () => Promise<void>;

  double: () => void;

  bank: number;
  setBank: React.Dispatch<React.SetStateAction<number>>;

  dealerCards: Card[];
  playerCards: Card[];

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
    payload?: EventData | undefined
  ) => State<
    any,
    any,
    any,
    {
      value: any;
      context: any;
    }
  >;
  deckCardNumber: number;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

let shuffleDeck = false;
export const setShuffleDeck = (input: boolean) => (shuffleDeck = input);

export let decks = 1;
export const setDecks = (input: number) => (decks = input);

const AppProvider = ({ children }: AppProviderProps) => {
  const initCards: Card[] = [
    { name: "card_back.jpg", number: "0", suit: "" },
    { name: "card_back.jpg", number: "0", suit: "" },
  ];
  let game = new Game();
  let roundbet = 0;

  const [loginPage] = React.useState("/#/login");
  const [homePage] = React.useState("/#/global");
  const [modal, setModal] = React.useState<any>(null);
  const [modalWidth, setModalWidth] = React.useState<number>(416);

  const [account, setAccount] = React.useState("");

  // const [decks, setDecks] = React.useState<number>(1);
  const [deckCardNumber, setDeckCardNumber] = React.useState<number>(52);

  const [bank, setBank] = React.useState<number>(1000);

  const [dealerCards, setDealerCards] = React.useState<Card[]>(initCards);
  const [playerCards, setPlayerCards] = React.useState<Card[]>(initCards);

  const setCard = () => {
    const { dealerCards, playerCards, deckCardNumber } = game.getCard();
    setDealerCards(dealerCards);
    setPlayerCards(playerCards);
    setDeckCardNumber(deckCardNumber);
    return { dealerCards, playerCards };
  };

  const checkShuffle = () => {
    const { deckCardNumber } = game.getCard();
    if (shuffleDeck || deckCardNumber < (decks * 52) / 2) {
      game.shuffleDeck(decks);
      antd.notification.success({
        message: "Shuffle Decks",
        duration: 1,
      });
      shuffleDeck = false;
    }
  };

  const double = () => {
    roundbet = roundbet * 2;
  };

  const machine = createMachine(
    {
      id: "game",
      initial: "beforeStart",
      states: {
        beforeStart: {
          on: { Start: "roundStart" },
          onEntry: (state, context) => {
            game = new Game();
            game.shuffleDeck(decks);
            setDeckCardNumber(decks * 52);
          },
        },
        roundStart: {
          on: {
            ReStart: {
              target: "beforeStart",
              actions: ["restart"],
            },
            Deal: "deal",
          },
          onEntry: (context: any, event: any) => {
            setDealerCards(initCards);
            setPlayerCards(initCards);
          },
        },
        deal: {
          on: {
            ReStart: {
              target: "beforeStart",
              actions: ["restart"],
            },
            Hit: { target: "hit", actions: ["hit"] },
            Stand: "stand",
          },
          onEntry: (context: any, event: any) => {
            const { bet } = event;
            roundbet = bet;
            checkShuffle();
            game.deal();
            setCard();
          },
        },
        hit: {
          on: {
            ReStart: {
              target: "beforeStart",
              actions: ["restart"],
            },
            Hit: { actions: ["hit"] },
            Stand: "stand",
          },
        },
        stand: {
          on: {
            End: "End",
            ReStart: {
              target: "beforeStart",
              actions: ["restart"],
            },
            NextRound: "roundStart",
          },
          onEntry: (context: any, event: any) => {
            let dealerNum = 0;
            while (dealerNum < 17) {
              dealerNum = game.dealerDraw() || 0;
            }
            const { playerCards } = setCard();
            const playerNum = cardnumCalc(playerCards);
            context.playerNum = playerNum;
            context.dealerNum = dealerNum;
            context.bet = roundbet;
          },
        },
        End: {
          on: {
            ReStart: {
              target: "beforeStart",
              actions: ["restart"],
            },
          },

          onEntry: (context: any, event: any) => {
            console.log("end!!!!");
          },
          onExit: () => {}, //退出
        },
      },
    },
    {
      actions: {
        hit: async (context, event) => {
          context.num = game.playerDraw() || 0;
          setCard();
        },
        restart: () => {
          setDealerCards(initCards);
          setPlayerCards(initCards);
        },
      },
    }
  );

  const [machineState, sendMachineState] = useMachine(machine);

  React.useEffect(() => {
    console.log(machineState.value);
    // console.log("state game id: ", game.getID());
  }, [machineState]);
  /////////////////////////////////////////////////////

  const fetch = async (
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    param?: any
  ) => {
    let data: any = null;

    try {
      //   const response = await axios({
      //     method,
      //     url,
      //     data: param,
      //   });
      const response: any = {};
      console.log("response", response.data);

      if (response.data.errorCode === 2) {
        window.location.href = loginPage;
        return null;
      }

      if (response.data.errorCode !== 0) {
        throw new Error(response.data.errorMessage);
      }

      data = response.data;
    } catch (error: any) {
      Notification.add("error", error.message);
    }

    return data;
  };

  const login = async (account: string, password: string): Promise<any> => {
    const data = await fetch("post", `/api/account/login`, {
      account,
      password,
    });

    setAccount(account);

    if (data) {
      if (data.errorCode === 0) {
        Notification.add("success", "Login");
        window.location.href = homePage;
      } else {
        window.location.href = loginPage;
      }
    } else {
      window.location.href = loginPage;
    }
  };

  const logout = async () => {
    await fetch("post", "/api/account/logout", {});
    window.location.href = loginPage;
  };

  const redirect = async () => {
    const data = await fetch("get", `/api/redirect`);
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
        double,
        bank,
        setBank,

        dealerCards,
        // setDealerCards,
        playerCards,
        // setPlayerCards,
        machineState,
        sendMachineState,
        deckCardNumber,
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
