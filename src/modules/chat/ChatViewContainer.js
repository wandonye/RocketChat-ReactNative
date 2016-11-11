import {connect} from 'react-redux';
import { sendMsg, receiveMsg, loadEarlier } from './ChatViewState';
import ChatView from './ChatView';

export default connect(
  state => ({
    chatState: state.get('chatState').toJS(),
    authState: state.get('auth').toJS()
  }),
  dispatch => ({
    sendMsg(messages) {
      dispatch(sendMsg(messages));
    },
    receiveMsg() {
      dispatch(receiveMsg());
    },
    loadEarlier() {
      dispatch(loadEarlier());
    }
  })
)(ChatView);
