import React from 'react';
import * as antd from 'antd';
import { AppContext } from '../AppContext';
import { Card } from '../class/Card';
import { cardnumCalc } from '../utils/cardnum';

interface CardsProps {
  cards: Card[];
  type: string;
}

const cardBack: Card = { name: 'card_back.jpg', number: '0', suit: '' };

const Cards = ({ cards, type }: CardsProps) => {
  const appCtx = React.useContext(AppContext);
  const [number, setNumber] = React.useState<number>(0);
  const [showCards, setShowCards] = React.useState<Card[]>([]);

  React.useEffect(() => {
    const num = cardnumCalc(cards);
    setNumber(num);

    if (cards.length === 1) {
      setShowCards(cards.concat([cardBack]));
    } else {
      setShowCards(cards);
    }
  }, [cards, cards.length]);

  return (
    <div className="row" style={{ minHeight: '270px' }}>
      <div className="col-8 d-flex align-items-center">
        <div className="row my-3 h-100 justify-content-end">
          {showCards.map((card) => (
            <div className="col-3 d-flex align-items-center">
              <antd.Image src={`/assets/cards/${card.name}`} preview={false} />
            </div>
          ))}
        </div>
      </div>
      <div className="col-4 d-flex justify-content-start align-items-center">
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'gray',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {number}
        </div>
        {type === 'player' &&
          appCtx.splitCard.length > 0 &&
          appCtx.splitCard.map((card) => (
            <div className="ms-4">
              <antd.Image height={'100px'} src={`/assets/cards/${card.name}`} preview={false} />
            </div>
          ))}
      </div>
    </div>
  );
};

export { Cards };
