import React from 'react';
import { AppContext } from '../AppContext';
import moment from 'moment';
import * as antd from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Header } from '../block/Header';
import dayjs from 'dayjs';
import { Notification } from '../components/Notification';

interface history {
  id: string;
  gamename: string;
  cardDecks: number;
  initBank: number;
  minBet: number;
  doubleAt11: boolean;
  datetime: Date;
}

export const HistoryPage = () => {
  const appCtx = React.useContext(AppContext);
  const [dataSource, setDataSource] = React.useState<history[]>([]); //coulmns data

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const pageSize = 10;

  const init = async (page: number = currentPage) => {
    try {
      await appCtx.redirect();
      const data = await appCtx.fetch('get', '/api/userhistory');
      if (data) {
        setDataSource(data.history);
        setTotal(data.num);
        setCurrentPage(page);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    appCtx.sendMachineState('ReStart');
    init();
  }, []);

  const columns: ColumnsType<history> = [
    {
      title: 'Game Name',
      align: 'center',
      dataIndex: 'gamename',
    },
    {
      title: 'Checkout Bank',
      align: 'center',
      dataIndex: 'checkout',
    },
    {
      title: 'Card Decks',
      align: 'center',
      dataIndex: 'cardDecks',
    },
    {
      title: 'Init Bank',
      align: 'center',
      dataIndex: 'initBank',
    },
    {
      title: 'Minimum Bet',
      align: 'center',
      dataIndex: 'minBet',
    },
    {
      title: 'Double only at 11',
      align: 'center',
      render: (item) => <antd.Switch checked={item.doubleAt11} />,
    },
    {
      title: 'Dealer hits on soft 17',
      align: 'center',
      render: (item) => <antd.Switch checked={item.H17} />,
    },
    {
      title: 'Blackjack Pay',
      align: 'center',
      render: (item) => <>{item.blackjackPay === 1.5 ? '3 to 2' : '6 to 5'}</>,
    },
    {
      title: 'Time',
      align: 'center',
      render: (item) => <>{dayjs(item.datetime).format('YYYY-MM-DD HH:mm')}</>,
    },
  ];

  return (
    <antd.Layout className="bg-white vh-100">
      <Header title="History" />
      <antd.Layout.Content>
        {/* <div className="d-flex justify-content-end my-2">
          <antd.Button
            type="primary"
            onClick={() => {
              appCtx.setModal(<CareteRoom />);
            }}
          >
            Create Room
          </antd.Button>
        </div> */}
        <antd.Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => init(page),
          }}
        />
      </antd.Layout.Content>
    </antd.Layout>
  );
};
