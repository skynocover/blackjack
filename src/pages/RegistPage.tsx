import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';
import axios from 'axios';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Notification } from '../components/Notification';

import { auth } from '../firebase/firebase';

const RegistPage = () => {
  const appCtx = React.useContext(AppContext);

  const regist = async (values: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      if (!token) throw new Error('Invalid token');
      appCtx.setToken(token);
      Notification.add('success', 'Regist success');
      window.location.href = '/#/lobby';
    } catch (error) {
      Notification.add('error', `${error.message}`);
    }
  };

  const RegistForm = () => {
    return (
      <antd.Form onFinish={regist}>
        <antd.Form.Item
          name="email"
          rules={[{ required: true, message: 'E-mail format not correct', type: 'email' }]}
        >
          <antd.Input prefix={<i className="fa fa-envelope" />} placeholder="Please Input E-mail" />
        </antd.Form.Item>

        <antd.Form.Item
          name="password"
          rules={[{ required: true, message: 'Password could not be empty!' }]}
        >
          <antd.Input.Password
            prefix={<i className="fa fa-lock" />}
            placeholder="Please Input Password"
          />
        </antd.Form.Item>

        <antd.Form.Item
          name="checkPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('password should be equal'));
              },
            }),
          ]}
        >
          <antd.Input.Password
            prefix={<i className="fa fa-lock" />}
            placeholder="Please Input Password again"
          />
        </antd.Form.Item>

        <antd.Form.Item className="text-center">
          <antd.Button type="primary" shape="round" htmlType="submit">
            Regist
          </antd.Button>
        </antd.Form.Item>
      </antd.Form>
    );
  };

  return (
    <div className="d-flex align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4 m-4 text-center font-weight-bold" style={{ fontSize: '20px' }}>
            Registing ...
          </div>
        </div>

        <div className="m-5" />

        <div className="row justify-content-center">
          <div className="col-4">
            <RegistForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export { RegistPage };
