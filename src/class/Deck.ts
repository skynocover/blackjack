import { Card } from './Card';
const cardNumber: string[] = [
  'ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'jack',
  'queen',
  'king',
];

const cardSuit: string[] = ['clubs', 'diamonds', 'hearts', 'spades'];

class Deck {
  private cards: Card[];
  constructor(decks: number) {
    this.cards = [];
    for (let i = 0; i < decks; i++) {
      for (let j = 0; j < cardNumber.length; j++) {
        for (let k = 0; k < cardSuit.length; k++) {
          this.cards.push(new Card(cardNumber[j], cardSuit[k]));
        }
      }
    }
    shuffle(this.cards);
  }

  popCard(): Card | undefined {
    return this.cards.pop();
  }

  number(): number {
    return this.cards.length;
  }
}

function shuffle(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export { Deck };
