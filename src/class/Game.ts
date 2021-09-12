import { Deck } from "./Deck";
import { Player, Dealer } from "./Player";
import { Card } from "./Card";
import { v4 as uuidv4 } from "uuid";

class Game {
  public deck: Deck;
  public dealer: Dealer;
  public player: Player;

  constructor() {
    this.deck = new Deck(1);
    this.dealer = new Dealer();
    this.player = new Player();
  }

  shuffleDeck(decks: number) {
    this.deck = new Deck(decks);
  }

  dealerDraw(): number | null {
    const card = this.deck.popCard();
    if (!card) return null;

    return this.dealer.draw(card);
  }

  playerDraw(): number | null {
    const card = this.deck.popCard();
    if (!card) return null;
    return this.player.draw(card);
  }

  deal() {
    this.dealer.clear();
    this.player.clear();

    const card1 = this.deck.popCard();
    if (!card1) return null;
    this.dealer.draw(card1);

    const card2 = this.deck.popCard();
    if (!card2) return null;
    this.player.draw(card2);
    const card3 = this.deck.popCard();
    if (!card3) return null;
    this.player.draw(card3);
  }

  getCard(): {
    dealerCards: Card[];
    playerCards: Card[];
    deckCardNumber: number;
  } {
    return {
      dealerCards: this.dealer.getHandCard(),
      playerCards: this.player.getHandCard(),
      deckCardNumber: this.deck.number(),
    };
  }
}

export { Game };
