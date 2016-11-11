import React, {PropTypes} from 'react';
import Drawer from 'react-native-drawer'
import {
  NavigationExperimental,
  StyleSheet
} from 'react-native';
import SideBarContentContainer from './SideBarContentContainer';
import NavigationViewContainer from '../navigation/NavigationViewContainer';
import ChatView from '../chat/ChatView'

const {
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes
} = NavigationExperimental;

const SideBarView = React.createClass({
  propTypes: {
    currentTabIndex: PropTypes.number.isRequired,
    isDrawerOpen: PropTypes.bool.isRequired,
    setDrawerClose: PropTypes.func.isRequired,
    setDrawerOpen: PropTypes.func.isRequired
  },

  render() {
    toggleDrawer = () => {
      if (this.props.isDrawerOpen) {
        this._drawer.close();
        this.props.setDrawerClose();
      } else {
        this._drawer.open();
        this.props.setDrawerOpen();
      }
    };
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<SideBarContentContainer/>}
        open={this.props.isDrawerOpen}
        openDrawerOffset={(viewport) => viewport.width - 100}
        styles={drawerStyles}
        acceptPan={false}
        onClose={this.props.setDrawerClose}
        side="right"
        tapToClose={true}
        tweenHandler={(ratio) => ({
          main: { opacity: Math.max(0.54, 1 - ratio) },
        })}
        >
        <NavigationViewContainer onToggleSideBar={toggleDrawer}/>
      </Drawer>
  );
  }
});

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
};

export default SideBarView;
