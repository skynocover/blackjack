import React from 'react';
import * as antd from 'antd';

import { AppContext, game } from '../AppContext';
import { Notification } from '../components/Notification';
import { client } from '../class/colyseus';

interface JoinRoomProps {
  roomId: string;
}

export const JoinRoom = ({ roomId }: JoinRoomProps) => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    try {
      appCtx.setModal(null);

      const room = await client.joinById(roomId, {
        token: appCtx.token,
        password: values.password,
      });

      if (room) {
        console.log(room);
        appCtx.setRoom(room);
        Notification.add('success', 'Create Room Success');
        window.location.href = '/#/game';
      } else {
        Notification.add('error', 'Add room fail');
      }
    } catch (error: any) {
      console.log(error.message);
      Notification.add('error', error.message);
    }
  };

  return (
    <antd.Form onFinish={onFinish}>
      <h5 className="font-weight-bold mb-4">Join room</h5>

      <antd.Form.Item name="password" label="Room password">
        <antd.Input.Password placeholder="Please Input Room Password" />
      </antd.Form.Item>

      <antd.Form.Item className="text-center">
        <antd.Button htmlType="submit">Join</antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
