import {Provider} from 'react-redux';
import React from 'react';
import {AppRegistry} from 'react-native';
import Meteor from 'react-native-meteor';
import * as CONST from './src/utils/constants';
import store from './src/redux/store';
import AppViewContainer from './src/modules/AppViewContainer';

const CoLang = React.createClass({
  componentWillMount() {
      Meteor.connect(CONST.CHAT_SERVER);
  },
  render() {
    return (
      <Provider store={store}>
        <AppViewContainer />
      </Provider>
    );
  }
});

AppRegistry.registerComponent('CoLang', () => CoLang);
