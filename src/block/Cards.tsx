import React from "react";
import * as antd from "antd";

import { Card } from "../class/Card";
import { cardnumCalc } from "../utils/cardnum";

interface CardsProps {
  cards: Card[];
}

const Cards = ({ cards }: CardsProps) => {
  const [number, setNumber] = React.useState<number>(0);
  React.useEffect(() => {
    const num = cardnumCalc(cards);
    setNumber(num);
  }, [cards, cards.length]);

  return (
    <div className="row">
      <div className="col-4 offset-4">
        <div className="row justify-content-center my-3">
          {cards.length === 1 ? (
            <>
              <div className="col-6">
                <antd.Image
                  src={`/assets/cards/${cards[0].name}`}
                  preview={false}
                />
              </div>
              <div className="col-6">
                <antd.Image
                  src={`/assets/cards/card_back.jpg`}
                  preview={false}
                />
              </div>
            </>
          ) : (
            cards.map((card) => (
              <div className="col-6">
                <antd.Image
                  src={`/assets/cards/${card.name}`}
                  preview={false}
                />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="col-4 d-flex justify-content-start align-items-center">
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "gray",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {number}
        </div>
      </div>
    </div>
  );
};

export { Cards };
