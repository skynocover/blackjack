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

  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

let shuffleDeck = false;
export const setShuffleDeck = (input: boolean) => (shuffleDeck = input);

let game = new Game();
export let roundbet = 0;
export let double = false;

export let decks = 1;
export const setDecks = (input: number) => (decks = input);

const AppProvider = ({ children }: AppProviderProps) => {
  const initCards: Card[] = [
    { name: "card_back.jpg", number: "0", suit: "" },
    { name: "card_back.jpg", number: "0", suit: "" },
  ];

  const [loginPage] = React.useState("/#/login");
  const [homePage] = React.useState("/#/global");
  const [modal, setModal] = React.useState<any>(null);
  const [modalWidth, setModalWidth] = React.useState<number>(416);

  const [account, setAccount] = React.useState("");

  const [deckCardNumber, setDeckCardNumber] = React.useState<number>(52);

  const [bank, setBank] = React.useState<number>(1000);

  const [backgroundImage, setBackgroundImage] = React.useState<string>("bg1");

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
      setDeckCardNumber(decks * 52);
    }
  };

  const machine = createMachine(
    {
      id: "game",
      initial: "beforeStart",
      states: {
        beforeStart: {
          on: { Start: "roundStart" },
          onEntry: (state, context) => {
            setBank(1000);
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
            double = false;
            setDealerCards(initCards);
            setPlayerCards(initCards);
            checkShuffle();
          },
        },
        deal: {
          on: {
            ReStart: {
              target: "beforeStart",
              actions: ["restart"],
            },
            Hit: { target: "hit", actions: ["hit"] },
            Double: {
              target: "stand",
              actions: ["double"],
            },
            Stand: "stand",
          },
          onEntry: (context: any, event: any) => {
            const { bet } = event;
            roundbet = bet;
            game.deal();
            const { playerCards } = setCard();
            if (playerCards.length === 2 && cardnumCalc(playerCards) === 21) {
              antd.notification.success({
                message: "Black Jack!!",
                duration: 1.5,
              });
            }
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
            context.blackjack = false;
            if (playerCards.length === 2 && playerNum === 21) {
              context.blackjack = true;
            }
            context.playerNum = playerNum;
            context.dealerNum = dealerNum;
            context.bet = double ? roundbet * 2 : roundbet;
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
        double: () => {
          setBank((prevState) => (prevState -= roundbet));
          game.playerDraw();
          setCard();
          double = true;
        },
      },
    }
  );

  const [machineState, sendMachineState] = useMachine(machine);

  React.useEffect(() => {
    // console.log(machineState.value);
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

        bank,
        setBank,

        dealerCards,
        playerCards,
        machineState,
        sendMachineState,
        deckCardNumber,

        backgroundImage,
        setBackgroundImage,
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
