import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import swal from 'sweetalert';
import { auth } from '../firebase/firebase';

const provider = new GoogleAuthProvider();

const LaunchPage = () => {
  const appCtx = React.useContext(AppContext);

  const init = async () => {
    try {
      await appCtx.redirect();
      window.location.href = appCtx.lobbyPage;
    } catch (error) {}
  };

  React.useEffect(() => {
    init();
  });
  return <></>;
};

const LoginPage = () => {
  const appCtx = React.useContext(AppContext);

  const googleLogin = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const token = await user.getIdToken();
      appCtx.setToken(token);

      window.location.href = appCtx.lobbyPage;
    } catch (error) {
      await swal(error.message);
    }
  };

  const emailLogin = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      appCtx.setToken(token);

      window.location.href = appCtx.lobbyPage;
    } catch (error) {
      await swal(error.message);
    }
  };

  const LoginForm = () => {
    return (
      <antd.Form
        // initialValues={{ account: '', password: '' }}
        onFinish={(values) => emailLogin(values.account, values.password)}
      >
        <antd.Form.Item
          name="account"
          rules={[{ required: true, message: 'E-mail could not be empty!' }]}
        >
          <antd.Input prefix={<i className="fa fa-user" />} placeholder="Please Input E-mail" />
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

        <antd.Form.Item className="text-center">
          <antd.Button type="primary" shape="round" htmlType="submit">
            Login
          </antd.Button>
        </antd.Form.Item>

        <antd.Form.Item className="text-center">
          <antd.Button
            type="primary"
            shape="round"
            onClick={() => {
              window.location.href = '/#/regist';
            }}
          >
            Regist
          </antd.Button>
        </antd.Form.Item>

        <antd.Form.Item className="text-center">
          <antd.Button type="primary" shape="round" onClick={googleLogin}>
            Login with Google
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
            Black Jack IO
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
