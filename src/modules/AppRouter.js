/*eslint-disable react/prop-types*/

import React from 'react';
import ChatViewContainer from './chat/ChatViewContainer';
import ChatListViewContainer from './chat/ChatListViewContainer';
import VideoCallView from './chat/VideoCallView';
import LoginViewContainer from './auth/LoginViewContainer';
import CounterViewContainer from './counter/CounterViewContainer';
import ColorViewContainer from './colors/ColorViewContainer'

/**
 * AppRouter is responsible for mapping a navigator scene to a view
 */

export default function AppRouter(props) {
  const key = props.scene.route.key;

  if (key === 'HomeTab') {
    return <CounterViewContainer />;
  }
  if (key === 'QATab') {
    return <CounterViewContainer />;
  }
  if (key === 'LoginTab') {
    return <LoginViewContainer />;
  }
  if (key === 'ChatTab') {
    //return <ChatViewContainer />;
    return <ChatListViewContainer />;
  }
  if (key === 'VideoCall') {
    return <VideoCallViewContainer />;
  }
  if (key.indexOf('Color') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
      <ColorViewContainer
        index={index}
      />
    );
  }

  throw new Error('Unknown navigation key: ' + key);
}
