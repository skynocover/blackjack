import React from 'react';
import * as antd from 'antd';
import { createMachine, EventData, State } from 'xstate';
import { Notification } from './components/Notification';
import { useMachine } from '@xstate/react';
import * as Colyseus from 'colyseus.js';
import { auth } from './firebase/firebase';
import axios from 'axios';
import swal from 'sweetalert';

interface AppContextProps {
  loginPage: string;
  lobbyPage: string;
  setModal: (modal: React.ReactNode | null, width?: number) => void;

  name: string;
  setName: (value: string) => void;

  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;

  fetch: (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    param?: any,
  ) => Promise<any>;

  redirect: () => Promise<boolean>;
  logout: () => Promise<void>;

  machineState: State<
    any,
    any,
    any,
    {
      value: any;
      context: any;
    }
  >;
  sendMachineState: (
    event: any,
    payload?: EventData | undefined,
  ) => State<
    any,
    any,
    any,
    {
      value: any;
      context: any;
    }
  >;

  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;

  room: Colyseus.Room<any> | undefined;
  setRoom: React.Dispatch<React.SetStateAction<Colyseus.Room<any> | undefined>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [loginPage] = React.useState('/#/login');
  const [lobbyPage] = React.useState('/#/lobby');
  const [modal, setModal] = React.useState<any>(null);
  const [modalWidth, setModalWidth] = React.useState<number>(416);

  const [name, setName] = React.useState<string>('');
  const [token, setToken] = React.useState<string>('');

  const [backgroundImage, setBackgroundImage] = React.useState<string>('bg1');
  const [room, setRoom] = React.useState<Colyseus.Room>();

  const machine = createMachine({
    id: 'game',
    initial: 'beforeStart',
    context: {},
    states: {
      beforeStart: {
        on: { Start: 'start' },
        onEntry: (state, context) => {},
      },
      start: {
        on: {
          ReStart: 'beforeStart',
          AllDeal: 'deal',
        },
        onEntry: (context, event) => {},
      },
      deal: {
        on: {
          ReStart: 'beforeStart',
          Hit: 'hit',
          Split: 'split',
          Stand: 'stand',
        },
      },
      hit: {
        on: {
          ReStart: 'beforeStart',
          Stand: 'stand',
          Start: 'start',
        },
      },
      split: {
        on: {
          ReStart: 'beforeStart',
          Stand: 'hit',
          // Hit:'hit',
          Start: 'start',
        },
      },
      stand: {
        on: {
          ReStart: 'beforeStart',
          Start: 'start',
        },
      },
    },
  });

  const [machineState, sendMachineState] = useMachine(machine);

  React.useEffect(() => {
    console.log('machineState: ', machineState.value);
  }, [machineState]);
  /////////////////////////////////////////////////////

  const fetch = async (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    param?: any,
  ) => {
    let data: any = null;

    try {
      const response = await axios({
        method,
        url,
        baseURL: process.env.REACT_APP_BASE_URL,
        data: param,
        headers: { Authorization: token },
      });
      console.log('response', response.data);

      if (response.data.errorCode === 9999 || response.data.errorCode === 3002) {
        window.location.href = loginPage;
        return null;
      }

      if (response.data.errorCode !== 0) {
        throw new Error(response.data.errorMessage);
      }

      data = response.data;
    } catch (error) {
      Notification.add('error', error.message);
    }

    return data;
  };

  const logout = async () => {
    await auth.signOut();

    window.location.href = loginPage;
  };

  const redirect = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          const token = await user?.getIdToken();
          if (!token) {
            window.location.href = loginPage;
            reject(false);
            return;
          }

          const response = await axios.post(
            process.env.REACT_APP_BASE_URL
              ? `${process.env.REACT_APP_BASE_URL}/api/account/login`
              : '/api/account/login',
            {},
            {
              headers: {
                Authorization: token,
              },
            },
          );

          if (response.data.errorCode === 3000) {
            let set = false;
            while (!set) {
              const name = await swal('Please set username', {
                content: { element: 'input' },
                closeOnClickOutside: false,
                closeOnEsc: false,
              });
              if (!name) continue;

              const response = await axios.post(
                process.env.REACT_APP_BASE_URL
                  ? `${process.env.REACT_APP_BASE_URL}/api/user`
                  : '/api/user',
                { name },
                {
                  headers: {
                    Authorization: token,
                  },
                },
              );

              if (response.data.errorCode === 3004) {
                await swal(response.data.errorMessage);
              } else {
                Notification.add('success', 'Set username success');
                set = true;
              }
            }
          } else {
            window.location.href = lobbyPage;
          }

          setToken(token);
          setName(response.data.name);

          window.location.href = lobbyPage;
          resolve(true);
        } catch (error) {
          reject(false);
        }
      });
    });
  };

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        loginPage,
        lobbyPage,
        setModal: (modal: React.ReactNode | null, width: number = 520) => {
          setModalWidth(width);
          setModal(modal);
        },

        name,
        setName,

        token,
        setToken,

        fetch,

        redirect,
        logout,

        machineState,
        sendMachineState,

        backgroundImage,
        setBackgroundImage,

        room,
        setRoom,
      }}
    >
      {modal && (
        <antd.Modal
          visible={modal !== null}
          onOk={() => setModal(null)}
          onCancel={() => setModal(null)}
          footer={null}
          closable={false}
          width={modalWidth}
        >
          {modal}
        </antd.Modal>
      )}

      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
