import {fromJS} from 'immutable';

// Initial state
const initialState = fromJS({
  rooms: {},
});

// Actions
const ADD_ROOMS = 'Chat/ROOM/ADD_ROOM_LIST';
const ADD_ROOM = 'Chat/ROOM/ADD_ROOM';
const UPDATE_LAST_MSG = 'Chat/ROOM/UPDATE_LAST_MSG';

// Action creators
export function addRoomList(rids) {
  return {
    type: ADD_ROOMS,
    payload: rids
  };
}
export function addRoom(rid) {
  return {
    type: ADD_ROOM,
    payload: rid
  };
}
export function updateLastMsg(rid, msg) {
  return {
    type: UPDATE_LAST_MSG,
    payload: [rid, msg]
  };
}

// Reducer
export default function ChatListStateReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ROOM: {
      var roomList = new Map(state.get('rooms'));
      if (roomList[action.payload]) {
        return state;
      }else{
        roomList[action.payload] = '';
        return state.set('rooms', fromJS(roomList));
      }
    }
    case ADD_ROOMS: {
      var roomList = new Map(state.get('rooms'));
      if (action.payload.length>0) {
        Object.keys(action.payload).forEach(function(key) {
            roomList[key] = action.payload[key];
        });
        return state.set('rooms', fromJS(roomList));
      }else{
        return state;
      }
    }
    case UPDATE_LAST_MSG: {
      var roomList = new Map(state.get('rooms'));
      roomList[action.payload[0]] = action.payload[1];
      return state.set('rooms', fromJS(roomList));
    }
    default:
      return state;
  }
}
