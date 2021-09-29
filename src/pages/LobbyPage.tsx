import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { CareteRoom } from '../modals/CreateRoom';
import { client } from '../class/colyseus';
import { JoinRoom } from '../modals/JoinRoom';
import { Notification } from '../components/Notification';
import { Header } from '../block/Header';

interface Room {
  id: string;
  name: string;
  playerNum: number;
  hasPassword: boolean;
  doubleAt11: boolean;
}

const LobbyPage = () => {
  const appCtx = React.useContext(AppContext);
  const [dataSource, setDataSource] = React.useState<Room[]>([]); //coulmns data

  // const [currentPage, setCurrentPage] = React.useState<number>(1);
  // const [total, setTotal] = React.useState<number>(0);
  // const pageSize = 10;

  const getRoomList = async () => {
    try {
      const rooms = await client.getAvailableRooms('my_room');

      rooms.map((room) => {
        console.log(room.clients);
      });

      const roomsData = rooms
        .filter((room) => room.metadata)
        .map((room) => {
          return {
            id: room.metadata.roomId,
            name: room.metadata.roomName,
            clients: room.clients,
            cardDecks: room.metadata.cardDecks,
            playerNum: room.maxClients,
            hasPassword: room.metadata.hasPassword,
            initBank: room.metadata.initBank,
            minBet: room.metadata.minBet,
            doubleAt11: room.metadata.doubleAt11,
          };
        });

      setDataSource(roomsData);
    } catch (error) {
      Notification.add('error', error.message);
    }
  };

  const init = async () => {
    try {
      await appCtx.redirect();

      const lobby = await client.joinOrCreate('lobby');

      lobby.onMessage('rooms', (rooms) => {
        console.log('rooms', rooms);
      });

      lobby.onMessage('+', async ([roomId, room]) => {
        await getRoomList();
      });

      lobby.onMessage('-', async (roomId) => {
        await getRoomList();
      });

      await getRoomList();
    } catch (error: any) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    appCtx.sendMachineState('ReStart');
    init();
  }, []);

  const joinRoom = async (roomId: string) => {
    try {
      const room = await client.joinById(roomId, {
        token: appCtx.token,
      });
      if (room) {
        console.log(room);
        appCtx.setRoom(room);
        Notification.add('success', 'Join Room Success');
        window.location.href = '/#/game';
      } else {
        Notification.add('error', 'Join room fail');
      }
    } catch (error) {
      Notification.add('error', error.message);
    }
  };

  const History = () => {
    appCtx.setModal(null);
    window.location.href = '/#/history';
  };

  const columns: ColumnsType<Room> = [
    // {
    //   title: 'Room-ID',
    //   align: 'center',
    //   dataIndex: 'id',
    // },
    {
      title: 'Room-Name',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: 'Players',
      align: 'center',
      render: (item) => `${item.clients}/${item.playerNum}`,
    },
    {
      title: 'Decks',
      align: 'center',
      dataIndex: 'cardDecks',
    },
    {
      title: 'Init Bank',
      align: 'center',
      dataIndex: 'initBank',
    },
    {
      title: 'Min Bet',
      align: 'center',
      dataIndex: 'minBet',
    },
    {
      title: 'Double only at 11',
      align: 'center',
      render: (item) => <antd.Switch checked={item.doubleAt11} />,
    },
    {
      title: '',
      align: 'center',
      render: (item) =>
        item.hasPassword ? (
          <antd.Tag color="volcano">Password Require</antd.Tag>
        ) : (
          <antd.Tag color="cyan">Free</antd.Tag>
        ),
    },
    {
      title: '',
      align: 'center',
      render: (item) => (
        <antd.Button
          type="primary"
          onClick={() => {
            item.hasPassword ? appCtx.setModal(<JoinRoom roomId={item.id} />) : joinRoom(item.id);
          }}
        >
          Join Room
        </antd.Button>
      ),
    },
  ];

  return (
    <antd.Layout className="bg-white vh-100">
      <Header title="Lobby" />
      <antd.Layout.Content>
        <div className="d-flex justify-content-end my-2">
          <antd.Button
            type="primary"
            onClick={() => {
              appCtx.setModal(<CareteRoom />);
            }}
          >
            Create Room
          </antd.Button>
        </div>
        <antd.Table dataSource={dataSource} columns={columns} pagination={false} />
      </antd.Layout.Content>
    </antd.Layout>
  );
};

export { LobbyPage };
