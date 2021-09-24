import React from 'react';
import * as antd from 'antd';

import { AppContext } from '../AppContext';
import { Notification } from '../components/Notification';
import { client } from '../class/colyseus';

export const CareteRoom = () => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    try {
      appCtx.setModal(null);

      const room = await client.create('my_room', {
        token: appCtx.token,
        roomName: values.roomName,
        maxClients: values.maxClients,
        cardDecks: values.cardDecks,
        password: values.password,
      });

      if (room) {
        appCtx.setRoom(room);
        Notification.add('success', 'Add room success');
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
    <antd.Form onFinish={onFinish} initialValues={{ maxClients: 1, cardDecks: 1, roomName: 'aaa' }}>
      <h5 className="font-weight-bold mb-4">Create room</h5>

      <antd.Form.Item
        name="roomName"
        label="Room name"
        rules={[{ required: true, message: 'Room Name Could Not Be Empty' }]}
      >
        <antd.Input placeholder="Please Input Room Name" />
      </antd.Form.Item>

      <antd.Form.Item name="password" label="Room password">
        <antd.Input.Password placeholder="Empty no need" />
      </antd.Form.Item>

      <antd.Form.Item name="maxClients" label="Player Number">
        <antd.Select>
          <antd.Select.Option value={1}>1</antd.Select.Option>
          <antd.Select.Option value={2}>2</antd.Select.Option>
          <antd.Select.Option value={3}>3</antd.Select.Option>
          <antd.Select.Option value={4}>4</antd.Select.Option>
          <antd.Select.Option value={5}>5</antd.Select.Option>
        </antd.Select>
      </antd.Form.Item>

      <antd.Form.Item name="cardDecks" label="Decks Number">
        <antd.Select>
          <antd.Select.Option value={1}>1</antd.Select.Option>
          <antd.Select.Option value={2}>2</antd.Select.Option>
          <antd.Select.Option value={4}>4</antd.Select.Option>
          <antd.Select.Option value={6}>6</antd.Select.Option>
        </antd.Select>
      </antd.Form.Item>

      <antd.Form.Item className="text-center">
        <antd.Button type="primary" htmlType="submit">
          Create
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
