import React from 'react';
import { AppContext } from '../AppContext';
import * as antd from 'antd';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const appCtx = React.useContext(AppContext);

  return (
    <antd.Layout.Header
      className="d-flex justify-content-between px-3 bg-white shadow-sm"
      style={{ zIndex: 1 }}
    >
      <div className="col-4">
        <span>{title}</span>
      </div>
      <div className="col-4 d-flex justify-content-end align-items-center">
        <antd.Popover
          placement="bottom"
          content={
            <div className="d-flex flex-column">
              <antd.Button type="link" onClick={() => (window.location.href = appCtx.lobbyPage)}>
                Lobby
              </antd.Button>
              <antd.Button type="link" onClick={() => (window.location.href = '/#/history')}>
                Play History
              </antd.Button>
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
  );
};
