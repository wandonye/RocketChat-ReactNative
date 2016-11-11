import React, {PropTypes} from 'react';
import { clearSnapshot } from '../../utils/snapshot';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Text,
  Image,
  NavigationExperimental,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
const {
  PropTypes: NavigationPropTypes
} = NavigationExperimental;

const SideBarContent = React.createClass({
  propTypes: {
    userName: PropTypes.string,
    userProfilePhoto: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    switchTab: PropTypes.func.isRequired,
    logOutSuccess: PropTypes.func.isRequired
  },
  contextTypes: {drawer: React.PropTypes.object},

  handleNavClick(item) {
    this.context.drawer.close();
    switch (item.name) {
      case 'logout': {
        clearSnapshot();
        this.props.logOutSuccess();
        this.props.switchTab(3);
        return;
      }
      case 'login': {
        this.props.switchTab(3);
        return;
      }
      case 'home': {
        this.props.switchTab(0);
        return;
      }
      case 'qanda': {
        this.props.switchTab(1);
        return;
      }
      case 'chat': {
        this.props.switchTab(2);
        return;
      }
      default: {
        console.warn("invalid action");
      }
    }
  },

  renderNavItem(item) {
    return (
      <TouchableOpacity
        onPress={this.handleNavClick.bind(this, item)}
        style={styles.navRow}
        key={item.name}
      >
        <Icon name={item.icon} style={styles.navIcon}/>
      </TouchableOpacity>
    );
  },

  renderNavItems(items) {
    return items.map(item => this.renderNavItem(item));
  },

  renderUserInfo() {
    if (!this.props.userName) {
      return null;
    }

    return (
        <Image
          style={styles.userProfilePhoto}
          source={{
            uri: this.props.userProfilePhoto,
            width: 80,
            height: 80
          }}
        />
    );
  },

  render() {
    var navigationLinks = [
      {
        name: 'home',
        icon: 'home',
      }, {
        name: 'qanda',
        icon: 'question-circle-o',
      }, {
        name: 'chat',
        icon: 'comment',
      },
    ];
    if (this.props.isLoggedIn) {
      navigationLinks = [
        ...navigationLinks,
        {
          name: 'logout',
          icon: 'sign-out',
        },
      ];
    }else {
      navigationLinks = [
        ...navigationLinks,
        {
          name: 'login',
          icon: 'sign-in',
        },
      ];
    }

    return (
      <View
      ref={(ref) => this._view = ref}
      style={styles.container}>
        {this.renderUserInfo()}
        {this.renderNavItems(navigationLinks)}
      </View>
    );
  }
});

const circle = {
  borderWidth: 0,
  borderRadius: 25,
  width: 50,
  height: 50
};

const styles = StyleSheet.create({
  userProfilePhoto: {
    ...circle,
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 15,
    paddingBottom: 15,
  },
  navRow: {
    flexDirection: 'row',
    height: 50,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    color: '#bdc3c7',
    fontSize: 25,
  },
});

export default SideBarContent;
