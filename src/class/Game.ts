import { Deck } from './Deck';
import { Player, Dealer } from './Player';
import { Card } from './Card';
import { Interpreter, AnyEventObject, createMachine, interpret } from 'xstate';
import { cardnumCalc } from '../utils/cardnum';

interface swalConfig {
  title: string;
  text: string;
}

class Game {
  private deck: Deck;
  private dealer: Dealer;
  private player: Player;
  private decks: number;
  private shuffle: boolean;
  // private splitCard: Card[];
  public GameMachine: Interpreter<
    any,
    any,
    AnyEventObject,
    {
      value: any;
      context: any;
    }
  >;

  constructor() {
    this.deck = new Deck(1);
    this.dealer = new Dealer();
    this.player = new Player();
    this.GameMachine = this.createMachine();
    this.decks = 1;
    this.shuffle = false;
    // this.splitCard = [];
  }

  public info(): {
    bank: number;
    decks: number;
    dealerCards: Card[];
    playerCards: Card[];
    deckCardNumber: number;
    splitCard: Card[];
  } {
    return {
      bank: this.player.bank,
      decks: this.decks,
      dealerCards: this.dealer.getHandCard(),
      playerCards: this.player.getHandCard(),
      deckCardNumber: this.deck.number(),
      splitCard: this.player.splitCard,
    };
  }

  public setDecks(input: number) {
    this.decks = input;
  }

  private initialGame() {
    this.deck = new Deck(this.decks);
    this.dealer = new Dealer();
    this.player = new Player();
    this.shuffle = false;
  }

  public dealerDraw(): number | null {
    const card = this.deck.popCard();
    if (!card) return null;
    return this.dealer.draw(card);
  }

  public playerDraw(): number | null {
    const card = this.deck.popCard();
    if (!card) return null;
    return this.player.draw(card);
  }

  private checkShuffle(): boolean {
    const deckCardNumber = this.deck.number();
    if (this.shuffle || deckCardNumber < (this.decks * 52) / 2) {
      this.deck = new Deck(this.decks);
      this.shuffle = false;
      return true;
    }
    return false;
  }

  private makeSwalConfig(dealerNum: number): swalConfig[] {
    const { result, playerNum } = this.player.checkBet(dealerNum);

    let config: swalConfig[] = [];
    for (let i = 0; i < result.length; i++) {
      switch (result[i]) {
        case -2:
          config.push({
            title: 'Dealer Win',
            text: `Player Bust: ${playerNum[i]}`,
          });
          break;
        case 2:
          config.push({
            title: 'Player Win',
            text: `Dealer Bust: ${dealerNum}`,
          });
          break;
        case -1:
          config.push({
            title: 'Dealer Win',
            text: `Dealer: ${dealerNum},Player: ${playerNum[i]}`,
          });
          break;
        case 1:
          config.push({
            title: 'Player Win',
            text: `Dealer: ${dealerNum},Player: ${playerNum[i]}`,
          });
          break;
        default:
          config.push({
            title: 'Push',
            text: `Dealer: ${dealerNum},Player: ${playerNum[i]}`,
          });
          break;
      }
    }
    return config;
  }

  private createMachine() {
    const GameMachine = createMachine(
      {
        id: 'game',
        initial: 'beforeStart',
        context: {},
        states: {
          beforeStart: {
            on: { Start: 'start' },
            onEntry: (state, context) => {
              this.initialGame();
            },
          },
          start: {
            on: {
              ReStart: 'beforeStart',
              Deal: 'deal',
            },
            onEntry: (context: any, event: any) => {
              this.dealer.clear();
              this.player.clear();
              const shuffle = this.checkShuffle();
              context.shuffle = shuffle;
            },
          },
          deal: {
            on: {
              ReStart: 'beforeStart',
              Hit: { target: 'hit', actions: ['hit'] },
              Double: { target: 'end', actions: ['double'] },
              End: 'end',
              Split: 'split',
            },
            onEntry: (context: any, event: any) => {
              const { bet } = event;
              this.player.bet = bet;
              this.player.bank -= bet;

              const card1 = this.deck.popCard();
              if (!card1) return null;
              this.dealer.draw(card1);

              const card2 = this.deck.popCard();
              if (!card2) return null;
              this.player.draw(card2);
              const card3 = this.deck.popCard();
              if (!card3) return null;
              this.player.draw(card3);
            },
          },
          split: {
            on: {
              ReStart: 'beforeStart',
              Hit: { actions: ['hit'] },
              End: { target: 'hit', actions: ['hit'] },
            },
            onEntry: (context: any, event: any) => {
              this.player.split();
              this.playerDraw();
              context.card = this.player.splitCard;
            },
            onExit: (context: any, event: any) => {
              this.player.splitBack();
              context.split = true;
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
              let dealerNum = cardnumCalc(this.dealer.getHandCard());
              while (dealerNum < 17) {
                dealerNum = this.dealerDraw() || 0;
              }
              context.swalConfig = this.makeSwalConfig(dealerNum);
              context.split = false;
            },
          },
        },
      },
      {
        actions: {
          hit: (context: any, event: any) => {
            context.num = this.playerDraw() || 0;
          },
          double: () => {
            this.player.bank -= this.player.bet;
            this.player.double = true;
            this.playerDraw();
          },
        },
      },
    );

    return interpret(GameMachine)
      .onTransition((state, context) => {
        console.log('back-end: ', state.value);
      })
      .start();
  }
}

export { Game };
