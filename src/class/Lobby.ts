import { Room, Client } from 'colyseus.js';

let lobby: Room<unknown> | undefined;

export const joinLobby = async (c: Client) => {
  try {
    lobby = await c.joinOrCreate('lobby');
    if (!lobby) {
      console.log('lobby is not available');
      return;
    }
    lobby.onMessage('rooms', (rooms) => {
      console.log('rooms', rooms);
    });

    lobby.onMessage('+', ([roomId, room]) => {
      console.log('roomId');
      console.log(roomId);
      console.log('room');
      console.log(room);
      //   getRooms();
    });

    lobby.onMessage('-', (roomId) => {
      //   getRooms();
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

// export function requestJoinOptions(this: Client, i: number) {
//   return { requestNumber: i };
// }

// export function onJoin(this: Room) {
//   console.log(this.sessionId, 'joined.');

//   this.onMessage('*', (type, message) => {
//     console.log('onMessage:', type, message);
//   });
// }

// export function onLeave(this: Room) {
//   console.log(this.sessionId, 'left.');
// }

// export function onError(this: Room, err: any) {
//   console.error(this.sessionId, '!! ERROR !!', err.message);
// }

// export function onStateChange(this: Room, state: any) {}
