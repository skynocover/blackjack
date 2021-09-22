import './App.css';
import * as ReactRouterDOM from 'react-router-dom';

import { LaunchPage, LoginPage, NotFoundPage } from './pages/LaunchPage';
import { GamePage } from './pages/GamePage';
import { LobbyPage } from './pages/LobbyPage';

function App() {
  return (
    <ReactRouterDOM.HashRouter>
      <ReactRouterDOM.Switch>
        <ReactRouterDOM.Route path="/" exact component={LaunchPage} />
        <ReactRouterDOM.Route path="/login" component={LoginPage} />
        <ReactRouterDOM.Route path="/lobby" component={LobbyPage} />
        <ReactRouterDOM.Route path="/game" component={GamePage} />

        {/* {menus.map((item) => (
          <ReactRouterDOM.Route key={item.key} path={item.key}>
            <MainPage menus={menus} title={item.title} icon={item.icon} content={item.component} />
          </ReactRouterDOM.Route>
        ))} */}

        <ReactRouterDOM.Route path="*" component={NotFoundPage} />
      </ReactRouterDOM.Switch>
    </ReactRouterDOM.HashRouter>
  );
}

export default App;
