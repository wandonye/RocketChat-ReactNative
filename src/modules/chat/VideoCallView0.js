'use strict';

import React, { Component,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ListView,
} from 'react-native';
import { mapHash } from '../../utils/helpers';

import io from 'socket.io-client/socket.io';

import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
let localStream;

function  getLocalStream(isFront, callback) {
    MediaStreamTrack.getSources(sourceInfos => {
      console.warn(sourceInfos);
      let videoSourceId;
      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
      getUserMedia({
        audio: true,
        video: {
          facingMode: isFront ? 'user' : 'environment',
          optional: [],
          mandatory: { minWidth: 800, minHeight: 600 },
          width: { min: 800, ideal: 1280 },
          height: { min: 600, ideal: 1024 }
        }
        // "audio": true,
        // "video": {
        //   optional: [{sourceId: videoSourceId}]
        // }
      }, function (stream) {
        console.log('dddd', stream);
        callback(stream);
      }, console.warn);
    });
  }

export default class VideoCallView extends React.Component {
  constructor(props) {
    super(props);
    this.pcPeers = {};

    this.socket = io.connect('https://react-native-webrtc.herokuapp.com',{transports: ['websocket']});
  }

  componentDidMount(){
    this.socket.on('exchange', function(data){
      exchange(data);
    });
    this.socket.on('leave', function(socketId){
      leave(socketId);
    });

    this.socket.on('connect', function(data) {
      console.log('connect');
      getLocalStream(true, function(stream) {
        console.warn('streamURL'+stream.toURL());
        localStream = stream;
        this.props.setSelfViewSrc(stream.toURL());
      });
    });
  }

  exchange(data) {
    const fromId = data.from;
    let pc;
    if (fromId in this.pcPeers) {
      pc = this.pcPeers[fromId];
    } else {
      pc = createPC(fromId, false);
    }

    if (data.sdp) {
      console.log('exchange sdp', data);
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        if (pc.remoteDescription.type == "offer")
          pc.createAnswer(function(desc) {
            console.log('createAnswer', desc);
            pc.setLocalDescription(desc, function () {
              console.log('setLocalDescription', pc.localDescription);
              this.socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
            }, console.warn);
          }, console.warn);
      }, console.warn);
    } else {
      console.log('exchange candidate', data);
      pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }

  leave(socketId) {
    console.log('leave', socketId);
    const pc = this.pcPeers[socketId];
    const viewIndex = pc.viewIndex;
    pc.close();
    delete this.pcPeers[socketId];

    const remoteList = this.props.remoteList;
    delete remoteList[socketId]
    // container.setState({ remoteList: remoteList });
    // container.setState({info: 'One peer leave!'});
  }

  getStats() {
    const pc = this.pcPeers[Object.keys(this.pcPeers)[0]];
    if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
      const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
      console.log('track', track);
      pc.getStats(track, function(report) {
        console.log('getStats report', report);
      }, console.warn);
    }
  }

  join(roomID) {
    this.socket.emit('join', roomID, function(socketIds){
      console.log('join', socketIds);
      for (const i in socketIds) {
        const socketId = socketIds[i];
        createPC(socketId, true);
      }
    });
  }

  createPC(socketId, isOffer) {
    const pc = new RTCPeerConnection(configuration);
    this.pcPeers[socketId] = pc;

    pc.onicecandidate = function (event) {
      console.log('onicecandidate', event.candidate);
      if (event.candidate) {
        this.socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
      }
    };

    function createOffer() {
      pc.createOffer(function(desc) {
        console.log('createOffer', desc);
        pc.setLocalDescription(desc, function () {
          console.log('setLocalDescription', pc.localDescription);
          this.socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
        }, console.warn);
      }, console.warn);
    }

    pc.onnegotiationneeded = function () {
      console.log('onnegotiationneeded');
      if (isOffer) {
        createOffer();
      }
    }

    pc.oniceconnectionstatechange = function(event) {
      console.log('oniceconnectionstatechange', event.target.iceConnectionState);
      if (event.target.iceConnectionState === 'completed') {
        setTimeout(() => {
          getStats();
        }, 1000);
      }
      if (event.target.iceConnectionState === 'connected') {
        createDataChannel();
      }
    };
    pc.onsignalingstatechange = function(event) {
      console.log('onsignalingstatechange', event.target.signalingState);
    };

    pc.onaddstream = function (event) {
      console.log('onaddstream', event.stream);

      const remoteList = this.props.remoteList;
      remoteList[socketId] = event.stream.toURL();
      // container.setState({ remoteList: remoteList });
    };
    pc.onremovestream = function (event) {
      console.log('onremovestream', event.stream);
    };

    pc.addStream(localStream);
    function createDataChannel() {
      if (pc.textDataChannel) {
        return;
      }
      const dataChannel = pc.createDataChannel("text");

      dataChannel.onerror = function (error) {
        console.log("dataChannel.onerror", error);
      };

      dataChannel.onmessage = function (event) {
        console.log("dataChannel.onmessage:", event.data);
        // container.receiveTextData({user: socketId, message: event.data});
      };

      dataChannel.onopen = function () {
        console.log('dataChannel.onopen');
        // container.setState({textRoomConnected: true});
      };

      dataChannel.onclose = function () {
        console.log("dataChannel.onclose");
      };

      pc.textDataChannel = dataChannel;
    }
    return pc;
  }

  _switchVideoType() {
    this.props.toggleFrontCamera();
    getLocalStream(isFront, function(stream) {
      if (localStream) {
        for (const id in this.pcPeers) {
          const pc = this.pcPeers[id];
          pc && pc.removeStream(localStream);
        }
        localStream.release();
      }
      localStream = stream;
      this.props.setSelfViewSrc(stream.toURL());

      for (const id in this.pcPeers) {
        const pc = this.pcPeers[id];
        pc && pc.addStream(localStream);
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.props.info}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text>
            {this.props.isFront ? "Use front camera" : "Use back camera"}
          </Text>
          <TouchableHighlight
            style={{borderWidth: 1, borderColor: 'black'}}
            onPress={this.props.toggleFrontCamera}>
            <Text>Switch camera</Text>
          </TouchableHighlight>
        </View>
        <RTCView streamURL={this.props.selfViewSrc} style={styles.selfView}/>
        <RTCView streamURL={this.props.remoteList[0]} style={styles.remoteView}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selfView: {
    width: 200,
    height: 150,
  },
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
    margin: 10,
  },
  listViewContainer: {
    height: 150,
  },
});

VideoCallView.defaultProps = {
  info: 'Initializing',
  status: 'init',
  isFront: false,
  selfViewSrc: '',
  remoteList: [],
  roomId: null,
  audio: true,
  video: true,
};

VideoCallView.propTypes = {
  info: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isFront: PropTypes.bool.isRequired,
  selfViewSrc: PropTypes.string,
  remoteList: PropTypes.object,
  roomId: PropTypes.string,
  audio: PropTypes.bool.isRequired,
  video: PropTypes.bool.isRequired,

  setSelfViewSrc: PropTypes.func.isRequired,
  toggleFrontCamera: PropTypes.func.isRequired,
  toggleAudio: PropTypes.func.isRequired,
  toggleVideo: PropTypes.func.isRequired
};
