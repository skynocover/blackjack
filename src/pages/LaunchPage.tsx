import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';

import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { CreateUser } from '../modals/CreateUser';
// import { client } from '../class/colyseus';

import axios from 'axios';

const provider = new GoogleAuthProvider();

const LaunchPage = () => {
  const appCtx = React.useContext(AppContext);

  const init = async () => {
    // await appCtx.connectWS();
    await appCtx.redirect();
  };

  React.useEffect(() => {
    init();
  }, []);
  return <></>;
};

const LoginPage = () => {
  const appCtx = React.useContext(AppContext);

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('user: ', user);

      const token = await user.getIdToken();
      if (!token) throw new Error('Invalid token');
      appCtx.setToken(token);

      const response = await axios.post(
        '/api/account/login',
        {},
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (response.data.errorCode === 3000) {
        // const data = await appCtx.fetch('post', '/api/user');
        appCtx.setModal(<CreateUser />);
      } else {
        window.location.href = appCtx.lobbyPage;
      }
    } catch (error: any) {
      alert(`error: ${error.message}`);
    }
  };

  const emailLogin = async (email: string, password: string) => {
    try {
      console.log(email, password);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('user');

      const token = await userCredential.user.getIdToken();
      appCtx.setToken(token);

      window.location.href = appCtx.lobbyPage;
    } catch (error: any) {
      alert(`error: ${error.message}`);
    }
  };

  const LoginForm = () => {
    return (
      <antd.Form
        initialValues={{ account: 'skynocover2@gmail.com', password: '123456' }}
        onFinish={(values) => emailLogin(values.account, values.password)}
      >
        <antd.Form.Item name="account" rules={[{ required: true, message: '帳號不可以空白!' }]}>
          <antd.Input prefix={<i className="fa fa-user" />} placeholder="請輸入帳號" />
        </antd.Form.Item>

        <antd.Form.Item name="password" rules={[{ required: true, message: '密碼不可以空白!' }]}>
          <antd.Input.Password prefix={<i className="fa fa-lock" />} placeholder="請輸入密碼" />
        </antd.Form.Item>

        <antd.Form.Item className="text-center">
          <antd.Button type="primary" shape="round" htmlType="submit">
            登入
          </antd.Button>
        </antd.Form.Item>

        <antd.Form.Item className="text-center">
          <antd.Button type="primary" shape="round" onClick={googleLogin}>
            使用google登入
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
            PEMAN 後台管理系統
          </div>
        </div>

        <div className="m-5" />

        <div className="row justify-content-center">
          <div className="col-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

const NotFoundPage = () => {
  return <></>;
};

export { LaunchPage, LoginPage, NotFoundPage };
