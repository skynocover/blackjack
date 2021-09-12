import React from "react";
import * as antd from "antd";

import { AppContext, setShuffleDeck, decks, setDecks } from "../AppContext";
import { Notification } from "../components/Notification";

export const SetDecks = () => {
  const appCtx = React.useContext(AppContext);

  React.useEffect(() => {}, []);

  const onFinish = async (values: any) => {
    appCtx.setModal(null);
    setDecks(values.num);
    setShuffleDeck(true);

    Notification.add("success", "Apply on next turn");
  };

  return (
    <antd.Form onFinish={onFinish} initialValues={{ num: decks }}>
      <h5 className="font-weight-bold mb-4">Set Decks</h5>

      <antd.Form.Item name="num" label="Deck Number">
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
