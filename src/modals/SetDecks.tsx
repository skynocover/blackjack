import React from 'react';
import * as antd from 'antd';

import { AppContext, game } from '../AppContext';
import { Notification } from '../components/Notification';

export const SetDecks = () => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);
    game.setDecks(values.decks);
    appCtx.setDecks(values.decks);

    Notification.add('success', 'Apply on next turn');
  };

  return (
    <antd.Form onFinish={onFinish} initialValues={{ decks: appCtx.decks }}>
      <h5 className="font-weight-bold mb-4">Set Decks</h5>

      <antd.Form.Item name="decks" label="Deck Number">
        <antd.Select>
          <antd.Select.Option value={1}>1</antd.Select.Option>
          <antd.Select.Option value={2}>2</antd.Select.Option>
          <antd.Select.Option value={4}>4</antd.Select.Option>
          <antd.Select.Option value={6}>6</antd.Select.Option>
        </antd.Select>
      </antd.Form.Item>

      <antd.Form.Item className="text-center">
        <antd.Button htmlType="submit">Set</antd.Button>
      </antd.Form.Item>
    </antd.Form>
  );
};
