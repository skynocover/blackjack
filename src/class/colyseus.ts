import * as Colyseus from 'colyseus.js';

const client = new Colyseus.Client(process.env.REACT_APP_WS_URL);

export { client };
