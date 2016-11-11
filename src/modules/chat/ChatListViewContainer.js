import React, { PropTypes } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import ChatListView from './ChatListView';
import {connect} from 'react-redux';
import { addRoomList, addRoom, updateLastMsg } from './ChatListState';

const ChatListViewContainer = (props) => {
  const {
    listReady, rooms, messages,
    userId, authToken,
    addRoomList, addRoom, updateLastMsg
  } = props;
  console.log('container', rooms);
  console.log('container', messages);
  return (
    <ChatListView
      listReady={listReady}
      rooms={rooms}
      messages={messages}
      userId={userId}
      authToken={authToken}
      addRoomList={addRoomList}
      addRoom={addRoom}
      updateLastMsg={updateLastMsg}
    />
  );
};

ChatListViewContainer.propTypes = {
  listReady: PropTypes.bool,
  rooms: PropTypes.array,
  messages: PropTypes.array,
};

const MeteorContainer = createContainer(() => {
  const handle0 = Meteor.subscribe('userChannels', Meteor.userId());
  const roomHandle = Meteor.subscribe('room', 'channels');
  const messagesHandle = Meteor.subscribe('messages', 'GENERAL');
  return {
    rooms: Meteor.collection('room').find(),
    messages: Meteor.collection('messages').find(),
    //listReady: roomHandle.ready()&&messagesHandle.ready(),
  };
}, ChatListViewContainer);

export default connect(
  state => ({
    userId: state.getIn(['auth','currentUser','userId']),
    authToken: state.getIn(['auth','authenticationToken'])
  }),
  dispatch => ({
    addRoomList(roomList) {
      dispatch(addRoomList(roomList));
    },
    addRoom(rid) {
      dispatch(addRoom(rid));
    },
    updateLastMsg(msg) {
      dispatch(updateLastMsg(msg));
    }
  })
)(MeteorContainer)
