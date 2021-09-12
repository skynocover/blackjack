import { Card } from "../class/Card";

export const cardnumCalc = (cards: Card[]): number => {
  let num = 0;

  for (const c of cards) {
    // console.log(c);
    switch (c.number) {
      case "ace":
        num += 11;
        if (num > 21) {
          num -= 10;
        }
        break;
      case "jack":
      case "queen":
      case "king":
        num += 10;
        break;
      default:
        num += +c.number;
        break;
    }
  }
  return num;
};
