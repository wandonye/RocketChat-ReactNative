import {connect} from 'react-redux';
import { sendMsg, receiveMsg, loadEarlier } from './ChatViewState';
import ChatActions from './ChatActions';
import {pushRoute} from '../navigation/NavigationState';

export default connect(
  state => ({
    typingText: state.getIn(['chatState', 'typingText'])
  }),
  dispatch => ({
    onSend(messages) {
      dispatch(sendMsg(messages));
    },
    pushRoute(route) {
      dispatch(pushRoute(route));
    }
  })
)(ChatActions);
