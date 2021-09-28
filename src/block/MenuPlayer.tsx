import * as antd from 'antd';
import { Card } from '../class/Card';
import { cardnumCalc } from '../utils/cardnum';

export interface player {
  handCard: Card[];
  splitCard: Card[];
  name: string;
  state: string;
  bet: string;
}

export const MenuPlayer = ({ name, handCard, state, bet, splitCard }: player) => {
  const Tag = () => {
    switch (state) {
      case 'pending':
        return <antd.Tag color="#B45309">{state}</antd.Tag>;
      case 'bust':
        return <antd.Tag color="red">{state}</antd.Tag>;
      case 'start':
        return <antd.Tag color="#10B981">{state}</antd.Tag>;
      case 'hit':
        return <antd.Tag color="#34D399">{state}</antd.Tag>;
      case 'out':
        return <antd.Tag color="#9CA3AF">{state}</antd.Tag>;
      default:
        return <antd.Tag color="#2563EB">{state}</antd.Tag>;
    }
  };

  return (
    <div className="my-2">
      <div
        className="d-flex flex-row mb-1"
        style={{ height: '40px', backgroundColor: '#F87171', borderRadius: 15 }}
      >
        <div className="d-flex align-items-center p-2">{name}</div>
      </div>
      <div className="d-flex flex-row mb-2" style={{ minHeight: '30px' }}>
        <div className="d-flex align-items-center">{`bet: ${bet}`}</div>
        <div className="flex-fill" />
        <div className="d-flex align-items-center">
          <Tag />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: 'gray',
            }}
          >
            {cardnumCalc(handCard)}
          </div>
        </div>
      </div>
      <div className="d-flex flex-row">
        {handCard.map((card) => (
          <div className="d-flex align-items-center">
            <antd.Image src={`/assets/cards/${card.name}`} preview={false} height={'100px'} />
          </div>
        ))}
      </div>
      <div className="d-flex flex-row">
        {splitCard.map((card) => (
          <div className="d-flex align-items-center">
            <antd.Image src={`/assets/cards/${card.name}`} preview={false} height={'100px'} />
          </div>
        ))}
      </div>
    </div>
  );
};
