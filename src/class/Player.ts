import { Card } from './Card';
import { cardnumCalc } from '../utils/cardnum';
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
    // this.double = false;
    // this.bet = 0;
  }
}

interface betResult {
  result: number[];
  playerNum: number[];
}

class Player extends User {
  public bet: number;
  public double: boolean;
  public bank: number;
  public splitCard: Card[];
  constructor() {
    super();
    this.bet = 0;
    this.double = false;
    this.bank = 1000;
    this.splitCard = [];
  }

  public split() {
    const card = this.handCard[1];
    this.handCard = [this.handCard[0]];
    this.splitCard = [card];

    this.bank -= this.bet;
  }

  public splitBack() {
    const temp = this.handCard;
    this.handCard = this.splitCard;
    this.splitCard = temp;
  }

  public clear() {
    this.handCard = [];
    this.double = false;
    this.bet = 0;
    this.splitCard = [];
  }

  public checkBet(dealerNum: number): betResult {
    let result: number[] = [];
    let playerNum: number[] = [];

    let playerCard = [this.handCard];
    if (this.splitCard.length > 0) {
      playerCard.push(this.splitCard);
    }
    for (const p of playerCard) {
      let num = cardnumCalc(p);

      if (num > 21) {
        result.push(-2); // player bust
      } else if (dealerNum > 21) {
        result.push(2); // dealer bust
      } else if (dealerNum > num) {
        result.push(-1); // dealer > player
      } else if (num > dealerNum) {
        result.push(1); // player > dealer
      } else {
        result.push(0); // push
        this.bank += this.bet;
      }
      if (result[0] > 0) {
        this.winBate(this.handCard);
      }
      playerNum.push(num);
    }
    return { result, playerNum };
  }
  private winBate(handCard: Card[]) {
    if (this.splitCard.length !== 0) {
      // if split
      this.bank += this.bet * 2;
    } else {
      if (handCard.length === 2 && cardnumCalc(handCard) === 21) {
        // if black jack
        this.bank += this.bet * 2.5;
      } else if (this.double) {
        // if double
        this.bank += this.bet * 4;
      } else {
        this.bank += this.bet * 2;
      }
    }
  }
}

class Dealer extends User {}

export { Dealer, Player };
