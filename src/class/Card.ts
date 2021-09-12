class Card {
  public name: string;
  public number: string;
  public suit: string;
  constructor(number: string, suit: string) {
    this.name = `${number}_of_${suit}.png`;
    this.suit = suit;
    this.number = number;
  }
}

export { Card };
