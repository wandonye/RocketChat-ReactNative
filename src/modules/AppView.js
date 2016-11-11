import React, {PropTypes} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import SideBarViewContainer from './sidebar/SideBarViewContainer';
import * as snapshotUtil from '../utils/snapshot';
import * as SessionStateActions from '../modules/session/SessionState';
import store from '../redux/store';
import DeveloperMenu from '../components/DeveloperMenu';
import Meteor from 'react-native-meteor';

const AppView = React.createClass({
  propTypes: {
    isReady: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  },

  componentDidMount() {
    // const name = Math.floor(Math.random() * 10);
    // Meteor.call('loadHistory', { name }, (err, res) => {
    //   // Do whatever you want with the response
    //   console.warn('loadHistory', err, res);
    // });
    snapshotUtil.resetSnapshot()
      .then(snapshot => {
        const {dispatch} = this.props;
        if (snapshot) {
          dispatch(SessionStateActions.resetSessionStateFromSnapshot(snapshot));
        } else {
          dispatch(SessionStateActions.initializeSessionState());
        }

        store.subscribe(() => {
          snapshotUtil.saveSnapshot(store.getState());
        });
      });
  },

  render() {
    if (!this.props.isReady) {
      return (
        <View>
          <ActivityIndicator style={styles.centered}/>
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <SideBarViewContainer />
        {__DEV__ && <DeveloperMenu />}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignSelf: 'center'
  }
});

export default AppView;
