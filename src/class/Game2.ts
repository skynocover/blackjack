import { Deck } from './Deck';
import { Player, Dealer } from './Player';
import { Card } from './Card';
import { Interpreter, AnyEventObject, createMachine, interpret } from 'xstate';
import { cardnumCalc } from '../utils/cardnum';

// class Game {
//   private deck: Deck;
//   private dealer: Dealer;
//   private player: Player;
//   private round: Round;
//   private decks: number;
//   private shuffle: boolean;
//   private splitCard: Card | null;
//   private split: boolean;
//   public GameMachine: Interpreter<
//     any,
//     any,
//     AnyEventObject,
//     {
//       value: any;
//       context: any;
//     }
//   >;

//   constructor() {
//     this.deck = new Deck(1);
//     this.dealer = new Dealer();
//     this.player = new Player();
//     this.GameMachine = this.createMachine();
//     this.round = new Round(false, 0);
//     this.decks = 1;
//     this.shuffle = false;
//     this.splitCard = null;
//     this.split = false;
//   }

//   public info(): {
//     bank: number;
//     decks: number;
//     dealerCards: Card[];
//     playerCards: Card[];
//     deckCardNumber: number;
//   } {
//     return {
//       bank: this.player.getBank(),
//       decks: this.decks,
//       dealerCards: this.dealer.getHandCard(),
//       playerCards: this.player.getHandCard(),
//       deckCardNumber: this.deck.number(),
//     };
//   }

//   public setDecks(input: number) {
//     this.decks = input;
//   }

//   private initialGame() {
//     this.deck = new Deck(1);
//     this.dealer = new Dealer();
//     this.player = new Player();
//     this.round = new Round(false, 0);
//     this.shuffle = false;
//     this.splitCard = null;
//     this.split = false;
//   }

//   private shuffleDeck(decks: number) {
//     this.deck = new Deck(decks);
//   }

//   public dealerDraw(): number | null {
//     const card = this.deck.popCard();
//     if (!card) return null;

//     return this.dealer.draw(card);
//   }

//   public checkSplit(): boolean {
//     return !!this.splitCard;
//   }

//   public splitBack() {
//     if (this.splitCard) {
//       this.player.clear();
//       this.player.draw(this.splitCard);
//       this.splitCard = null;
//     }
//   }

//   public playerDraw(): number | null {
//     const card = this.deck.popCard();
//     if (!card) return null;
//     return this.player.draw(card);
//   }

//   private checkShuffle(): boolean {
//     const deckCardNumber = this.deck.number();
//     if (this.shuffle || deckCardNumber < (this.decks * 52) / 2) {
//       this.shuffleDeck(this.decks);
//       this.shuffle = false;
//       return true;
//     }
//     return false;
//   }

//   private createMachine() {
//     const GameMachine = createMachine(
//       {
//         id: 'game',
//         initial: 'beforeStart',
//         context: {},
//         states: {
//           beforeStart: {
//             on: { Start: 'start' },
//             onEntry: (state, context) => {
//               this.player.setBank(1000);
//               this.initialGame();
//               this.shuffleDeck(this.decks);
//             },
//           },
//           start: {
//             on: {
//               ReStart: {
//                 target: 'beforeStart',
//                 actions: ['restart'],
//               },
//               Deal: 'deal',
//             },
//             onEntry: (context: any, event: any) => {
//               this.split = false;
//               this.round.setDouble(false);
//               this.dealer.clear();
//               this.player.clear();
//               const shuffle = this.checkShuffle();
//               context.shuffle = shuffle;
//             },
//           },
//           deal: {
//             on: {
//               ReStart: {
//                 target: 'beforeStart',
//                 actions: ['restart'],
//               },
//               Hit: { target: 'hit', actions: ['hit'] },
//               Double: {
//                 target: 'stand',
//                 actions: ['double'],
//               },
//               Stand: 'stand',
//               Split: { target: 'hit', actions: ['split', 'hit'] },
//             },
//             onEntry: (context: any, event: any) => {
//               const { bet } = event;
//               this.round.setBet(bet);
//               this.player.setBank(this.player.getBank() - bet);
//               // this.dealer.clear();
//               // this.player.clear();

//               const card1 = this.deck.popCard();
//               if (!card1) return null;
//               this.dealer.draw(card1);

//               const card2 = this.deck.popCard();
//               if (!card2) return null;
//               this.player.draw(card2);
//               const card3 = this.deck.popCard();
//               if (!card3) return null;
//               this.player.draw(card3);
//             },
//           },
//           hit: {
//             on: {
//               ReStart: {
//                 target: 'beforeStart',
//                 actions: ['restart'],
//               },
//               Hit: { actions: ['hit'] },
//               Stand: 'stand',
//             },
//           },
//           stand: {
//             on: {
//               End: 'End',
//               ReStart: {
//                 target: 'beforeStart',
//                 actions: ['restart'],
//               },
//               Hit: { target: 'hit', actions: ['hit'] },
//               NextRound: 'start',
//             },
//             onEntry: (context: any, event: any) => {

//             },
//           },
//           End: {
//             on: {
//               ReStart: {
//                 target: 'beforeStart',
//                 actions: ['restart'],
//               },
//             },

//             onEntry: (context: any, event: any) => {
//               console.log('end!!!!');
//             },
//             onExit: () => {}, //退出
//           },
//         },
//       },
//       {
//         actions: {
//           split: (context: any, event: any) => {
//             if (!this.split) {
//               this.splitCard = this.player.split();
//               this.split = true;
//               context.card = this.splitCard;
//             } else {
//               return;
//             }
//           },
//           hit: async (context: any, event: any) => {
//             context.num = this.playerDraw() || 0;
//           },
//           restart: () => {
//             this.dealer.clear();
//             this.player.clear();
//           },
//           double: () => {
//             this.player.setBank(this.player.getBank() - this.round.getBet());
//             this.playerDraw();
//             this.round.setDouble(true);
//           },
//         },
//       },
//     );

//     return interpret(GameMachine)
//       .onTransition((state, context) => {})
//       .start();
//   }
// }

// export { Game };
