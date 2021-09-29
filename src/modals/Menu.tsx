import React from 'react';
import * as antd from 'antd';

import { AppContext } from '../AppContext';
import { Notification } from '../components/Notification';
import { client } from '../class/colyseus';

interface MenuProps {
  minBet: number;
  doubleAt11: boolean;
  H17: boolean;
  blackjackPay: number;
}

export const Menu = ({ minBet, doubleAt11, H17, blackjackPay }: MenuProps) => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {}, []);

  const leaveRoom = async () => {
    appCtx.setModal(null);
    appCtx.room?.leave();
    appCtx.setRoom(undefined);
    appCtx.sendMachineState('ReStart');
    window.location.href = '/#/lobby';
  };

  return (
    <>
      <div className="d-flex flex-column">
        <antd.Descriptions bordered column={1}>
          <antd.Descriptions.Item label="Minimum bet">{minBet}</antd.Descriptions.Item>
          <antd.Descriptions.Item label="Blackjack pay">
            {blackjackPay === 1.5 ? '3 to 2' : '6 to 5'}
          </antd.Descriptions.Item>
          <antd.Descriptions.Item label="Double only at 11">
            <antd.Switch checked={doubleAt11} />
          </antd.Descriptions.Item>
          <antd.Descriptions.Item label="Dealer hits on soft 17">
            <antd.Switch checked={H17} />
          </antd.Descriptions.Item>
          <antd.Descriptions.Item label="Background">
            <antd.Select
              value={appCtx.backgroundImage}
              defaultValue={'bg1'}
              onChange={(value) => appCtx.setBackgroundImage(`${value}`)}
            >
              <antd.Select.Option value={'bg1'}>background1</antd.Select.Option>
              <antd.Select.Option value={'bg2'}>background2</antd.Select.Option>
              <antd.Select.Option value={'bg3'}>background3</antd.Select.Option>
              <antd.Select.Option value={'bg4'}>background4</antd.Select.Option>
            </antd.Select>
          </antd.Descriptions.Item>
        </antd.Descriptions>

        <antd.Button type="link" danger onClick={leaveRoom}>
          Check Out
        </antd.Button>
      </div>
    </>
  );
};
