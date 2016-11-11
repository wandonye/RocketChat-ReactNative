import {connect} from 'react-redux';
import { setStateOpen, setStateClose } from '../navigation/NavigationState';
import SideBarView from './SideBarView';

export default connect(
  state => ({
    currentTabIndex: state.getIn(['navigationState','tabs','index']),
    isDrawerOpen: state.getIn(['navigationState','isSideBarShown'])
  }),
  dispatch => ({
    setDrawerOpen() {
      dispatch(setStateOpen());
    },
    setDrawerClose() {
      dispatch(setStateClose());
    }
  })
)(SideBarView);
