import { Card } from "../class/Card";

export const cardnumCalc = (cards: Card[]): number => {
  let num = 0;

  for (const c of cards) {
    // console.log(c);
    switch (c.number) {
      case "ace":
        num += 11;
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
  if (num > 21) {
    for (const c of cards) {
      if (c.number === "ace") {
        num -= 10;
        if (num <= 21) {
          break;
        }
      }
    }
  }

  return num;
};
