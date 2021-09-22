import * as Colyseus from 'colyseus.js';

const protocol = window.location.protocol;
// const url = `${protocol === 'http:' ? 'ws' : 'wss'}://${window.location.host}/wsp`;
// const url = 'ws://localhost:8080';
// const url = '/ws';
// const url = process.env.REACT_APP_ENV === 'development' ? 'ws://localhost:8080' : '/';
// console.log(url);

const client = new Colyseus.Client(process.env.REACT_APP_WS_URL);

export { client };
