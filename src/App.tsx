import './App.css';
import * as ReactRouterDOM from 'react-router-dom';

import { LaunchPage, LoginPage, NotFoundPage } from './pages/LaunchPage';
import { GamePage } from './pages/GamePage';
import { LobbyPage } from './pages/LobbyPage';
import { RegistPage } from './pages/RegistPage';

function App() {
  return (
    <ReactRouterDOM.HashRouter>
      <ReactRouterDOM.Switch>
        <ReactRouterDOM.Route path="/" exact component={LaunchPage} />
        <ReactRouterDOM.Route path="/login" component={LoginPage} />
        <ReactRouterDOM.Route path="/lobby" component={LobbyPage} />
        <ReactRouterDOM.Route path="/game" component={GamePage} />
        <ReactRouterDOM.Route path="/regist" component={RegistPage} />
        <ReactRouterDOM.Route path="*" component={NotFoundPage} />
      </ReactRouterDOM.Switch>
    </ReactRouterDOM.HashRouter>
  );
}

export default App;
