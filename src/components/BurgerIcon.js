import React, { Component, PropTypes } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default React.createClass({
  displayName: 'BurgerIcon',
  propTypes: {
    action: PropTypes.func.isRequired
  },
  render() {
    return (
      <TouchableOpacity onPress={this.props.action} style={styles.burgerButton}>
        <Icon name="bars" style={styles.burgerIcon}/>
      </TouchableOpacity>
    );
  }
});

const styles = StyleSheet.create({
  burgerButton: {
    width: 50,
    height: 50,
    bottom: 4,
    left: 2,
    padding: 12,
  },
  burgerIcon: {
    fontSize: 22,
    color: '#ffff',
  },
});
