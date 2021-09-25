import React from 'react';
import * as antd from 'antd';

import { AppContext } from '../AppContext';
import { Notification } from '../components/Notification';

export const CreateUser = () => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    try {
      appCtx.setModal(null);

      const data = await appCtx.fetch('post', '/api/user', { name: values.userName });
      if (data) {
        Notification.add('success', 'Create user success');
        window.location.href = appCtx.lobbyPage;
      } else {
        Notification.add('error', 'Create user fail');
      }
    } catch (error: any) {
      console.log(error.message);
      Notification.add('error', error.message);
    }
  };

  return (
    <antd.Form onFinish={onFinish} initialValues={{ playerNum: 2, roomName: 'aaa' }}>
      <h5 className="font-weight-bold mb-4">Create room</h5>

      <antd.Form.Item
        name="userName"
        label="User name"
        rules={[{ required: true, message: 'User Name Could Not Be Empty' }]}
      >
        <antd.Input placeholder="Please Input User Name" />
      </antd.Form.Item>

      <antd.Form.Item className="text-center">
        <antd.Button type="primary" htmlType="submit">
          Create
        </antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
