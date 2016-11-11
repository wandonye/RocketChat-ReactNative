'use strict';

import React, { Component,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions
} from 'react-native';
import { getLocalStream } from '../../utils/helpers';
import Meteor from 'react-native-meteor';

import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
} from 'react-native-webrtc';

const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class VideoCallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: 'Initializing',
      status: 'init', //'ready', 'connected', 'disconnected'
      isFront: false,
      selfViewSrc: '',
      remoteSrc: '', //init with props or connect later
      audio: true,
      video: true,
      selfieWidth: 0.5, //percent of Dimensions.get('window').width
      selfieHeight: 0.5,  //percent of Dimensions.get('window').height
    };
    this.localStream = null;
    this.toggleVideo = this.toggleVideo.bind(this);
    this.toggleFrontCamera = this.toggleFrontCamera.bind(this);
    this.setSelfViewSrc = this.setSelfViewSrc.bind(this);
  }
  componentDidMount() {
    Meteor.call('webrtc', '', 'public', 5, (err, res) => {
      // Do whatever you want with the response
      console.warn('webrtc', err, res);
    });
    getLocalStream(this.state.isFront, this.setSelfViewSrc);
  }

  setSelfViewSrc(stream) {
    if (this.localStream) {
      //remove from remote
      this.localStream.release();
    }
    console.warn(stream);
    this.localStream = stream;
    this.setState({selfViewSrc : stream.toURL()});
    this.setState({status : 'ready'});
    this.setState({info : 'local camera ready'});
    console.warn(this.state.selfViewSrc);
  }

  toggleVideo(){
    this.setState({video : !this.state.video});
  }
  toggleFrontCamera(){
    const isFront = !this.state.isFront;
    this.setState({isFront:isFront});
    getLocalStream(isFront, this.setSelfViewSrc);
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.welcome}>
        {this.state.info}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <Text>
          {this.state.isFront ? "Use front camera" : "Use back camera"}
        </Text>
        <TouchableHighlight
          style={{borderWidth: 1, borderColor: 'black'}}
          onPress={this.toggleFrontCamera}>
          <Text>Switch camera</Text>
        </TouchableHighlight>
      </View>
        { this.state.video ?
          (<RTCView
            style={{
              width: this.state.selfieWidth * windowWidth,
              height: this.state.selfieHeight * windowHeight
            }}
            streamURL={this.state.selfViewSrc}
          />) : null
        }
      </View>
    );
  }
}
// <RTCView streamURL={this.state.remoteSrc} style={styles.remoteView}/>

const styles = StyleSheet.create({
  remoteView: {
    width: 200,
    height: 150,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 0,
  },
});

VideoCallView.defaultProps = {
  roomId: null,
  friendId: '',
};

VideoCallView.propTypes = {
  roomId: PropTypes.string,
  friendId: PropTypes.string,
};
