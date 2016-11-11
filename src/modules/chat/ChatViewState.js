import {fromJS} from 'immutable';
import {NavigationExperimental} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';

// Initial state
const initialState = fromJS({
  messages: [],
  canLoadEarlier: true,
  typingText: "",
  isLoadingEarlier: false,
});

// Actions
const SEND = 'Chat/SEND';
const RECEIVE = 'Chat/RECEIVE';
const LOAD_EARLIER = 'Chat/LOAD_EARLIER';
const SET_TYPING_TEXT = 'Chat/SET_TYPING_TEXT';

// Action creators
export function sendMsg(messages) {
  return {
    type: SEND,
    payload: messages
  };
}

export function receiveMsg() {
  return {
    type: RECEIVE
  };
}

export function loadEarlier() {
  return {
    type: LOAD_EARLIER
  };
}

export function setTypingText(text) {
  return {
    type: SET_TYPING_TEXT,
    payload: text
  };
}


// Reducer
export default function ChatViewStateReducer(state = initialState, action) {
  switch (action.type) {
    case SEND: {
      if (action.payload.length>0) {
        var tmpMsgList = state.get('messages').slice();
        return state.set('messages', fromJS(action.payload).concat(tmpMsgList));
      }
      return state;
    }
    case RECEIVE: {
      // Push a route into the scenes stack.
      return state;
    }
    case LOAD_EARLIER: {
      //TODO: attach new msg here
      return state.set('isLoadingEarlier', true);
    }
    case SET_TYPING_TEXT: {
      return state.set('typingText', action.payload);
    }
    default:
      return state;
  }
}
