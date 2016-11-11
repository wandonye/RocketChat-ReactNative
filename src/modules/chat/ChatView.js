import React, {PropTypes} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';
import ChatActionsContainer from './ChatActionsContainer';
import CustomView from './CustomView';
import Meteor from 'react-native-meteor';

const ChatView = React.createClass({
  propTypes: {
    chatState: PropTypes.shape({
      messages: PropTypes.array.isRequired,
      canLoadEarlier: PropTypes.bool.isRequired,
      typingText: PropTypes.string.isRequired,
      isLoadingEarlier: PropTypes.bool.isRequired
    }),
    authState: PropTypes.shape({
      isLoggedIn: PropTypes.bool.isRequired,
      currentUser: PropTypes.object,
      authenticationToken: PropTypes.string
    }),
    sendMsg: PropTypes.func.isRequired,
    loadEarlier: PropTypes.func.isRequired,
    receiveMsg: PropTypes.func.isRequired
  },

  renderChatActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <ChatActionsContainer
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <ChatActionsContainer
        {...props}
        options={options}
      />
    );
  },

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  },

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  },

  renderFooter(props) {
    if (this.props.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  },

  render() {
    Meteor.call('loadHistory', 'GENERAL', (err, res) => {
      // Do whatever you want with the response
      //console.warn('msg', err, res);
    });
    return (
      <GiftedChat
        messages={this.props.chatState.messages}
        onSend={this.props.sendMsg}
        canLoadEarlier={this.props.chatState.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.props.chatState.isLoadingEarlier}

        user={{
          _id: this.props.currentUser?this.props.currentUser.userId:1, // sent messages should have same user._id
        }}

        renderActions={this.renderChatActions}
        renderBubble={this.renderBubble}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
      />
    );
  }
});

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

export default ChatView;
