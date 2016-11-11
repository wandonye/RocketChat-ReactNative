'use strict';

import React, { Component,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ListView,
  Dimensions
} from 'react-native';
import Meteor, {MeteorListView} from 'react-native-meteor';
import SGListView from 'react-native-sglistview';
import * as CONST from '../../utils/constants';

export default class ChatListView extends React.Component {
  constructor(props) {
    super(props);
    fetch(CONST.API_JOINROOM, {
      method: 'GET',
      headers: {
              "X-Auth-Token": props.authToken,
              "X-User-Id": props.userId
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status=='success'){
          props.addRoomList(responseJson.rooms)
          console.log('succes',responseJson);
        }else {
          console.log('failed',responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  // componentDidMount() {
  //   Meteor.call('channelsList', '', 'd', (err, res) => {
  //     // Do whatever you want with the response
  //     console.warn('all channels', err, res);
  //   });
  // }
  renderItem(item) {
    console.log(item);
    return (
      <ListItem>
          <Text>{item}</Text>
      </ListItem>
    );
  }
  getDataSource() {
    //TODO: ds has to be a array?
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
        return ds.cloneWithRows(this.props.rooms);
    }
  render() {
    // if (!this.props.listReady) {
    //   return (<Text>Loading</Text>);
    // }
    console.warn(Meteor.collection('userChannels').find().length);
    console.warn(Meteor.collection('room').find());
    console.warn(Meteor.collection('messages').find());
    if (Meteor.collection('room').find().length>0){
      return (
        <MeteorListView
          collection="rooms"
          renderRow={this.renderItem}
          enableEmptySections={true}
          //...other listview props
        />);
    }else {
      return (
        <SGListView
          dataSource={this.getDataSource()} //data source
          ref={'listview'}
          initialListSize={1}
          stickyHeaderIndices={[]}
          onEndReachedThreshold={1}
          scrollRenderAheadDistance={1}
          pageSize={1}
          renderRow={(item) =>
              <ListItem>
                  <Text>{item}</Text>
              </ListItem>
          }
          />
      );
    }


  }
};

ChatListView.propTypes = {
  listReady: PropTypes.bool,
  rooms: PropTypes.array,
  messages: PropTypes.array,
  userId: PropTypes.string,
  authToken: PropTypes.string,
  addRoomList: PropTypes.func.isRequired,
  addRoom: PropTypes.func.isRequired,
  updateLastMsg: PropTypes.func.isRequired
};
