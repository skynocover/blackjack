import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { CareteRoom } from '../modals/CreateRoom';
import { joinLobby } from '../class/Lobby';
import * as Colyseus from 'colyseus.js';
import { client } from '../class/colyseus';
import { JoinRoom } from '../modals/JoinRoom';
import { Notification } from '../components/Notification';

interface Room {
  id: string;
  name: string;
  playerNum: number;
  ownerName: string;
  hasPassword: boolean;
}

const LobbyPage = () => {
  const appCtx = React.useContext(AppContext);
  const [dataSource, setDataSource] = React.useState<Room[]>([]); //coulmns data

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const pageSize = 10;

  const getRoomList = async () => {
    const rooms = await client.getAvailableRooms('my_room');
    const roomsData = rooms.map((room) => {
      return {
        id: room.metadata.roomId,
        name: room.metadata.roomName,
        ownerName: room.metadata.ownerName,
        cardDecks: room.metadata.cardDecks,
        playerNum: room.maxClients,
        hasPassword: room.metadata.hasPassword,
      };
    });
    setDataSource(roomsData);
  };

  const init = async () => {
    try {
      await appCtx.redirect();

      const lobby = await client.joinOrCreate('lobby');
      // console.log(lobby);

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
    init();
  }, []);

  const joinRoom = async (roomId: string) => {
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
  };

  const columns: ColumnsType<Room> = [
    {
      title: 'Room-Name',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: 'Owner-Name',
      align: 'center',
      dataIndex: 'ownerName',
    },
    {
      title: 'Player-Number',
      align: 'center',
      dataIndex: 'playerNum',
    },
    {
      title: 'Decks',
      align: 'center',
      dataIndex: 'cardDecks',
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
      <antd.Layout.Header
        className="d-flex justify-content-between px-3 bg-white shadow-sm"
        style={{ zIndex: 1 }}
      >
        <div className="col-4">
          <span>Lobby</span>
        </div>
        <div className="col-4 d-flex justify-content-end align-items-center">
          <antd.Popover
            placement="bottom"
            content={
              <div className="d-flex flex-column">
                <antd.Button type="link" danger onClick={appCtx.logout}>
                  Logout
                </antd.Button>
              </div>
            }
          >
            <antd.Button type="link">Menu</antd.Button>
          </antd.Popover>
        </div>
      </antd.Layout.Header>
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
