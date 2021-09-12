import { Card } from "./Card";
import { cardnumCalc } from "../utils/cardnum";
class User {
  public handCard: Card[];
  constructor() {
    this.handCard = [];
  }

  public draw(card: Card): number {
    this.handCard.push(card);
    return cardnumCalc(this.handCard);
  }

  public getHandCard(): Card[] {
    return this.handCard;
  }

  public clear() {
    this.handCard = [];
  }
}

class Player extends User {}

class Dealer extends User {}

export { Dealer, Player };
