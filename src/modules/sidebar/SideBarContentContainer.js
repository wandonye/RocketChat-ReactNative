import {connect} from 'react-redux';
import { switchTab } from '../navigation/NavigationState';
import { onUserLogoutSuccess } from '../auth/AuthState'
import SideBarContent from './SideBarContent';

export default connect(
  state => ({
    isLoggedIn: state.getIn(['auth', 'isLoggedIn']),
    userName: state.getIn(['auth', 'currentUser', 'name']),
    userProfilePhoto: state.getIn(['auth', 'currentUser', 'picture'])
  }),
  dispatch => ({
    switchTab(index) {
      dispatch(switchTab(index));
    },
    logOutSuccess() {
      dispatch(onUserLogoutSuccess());
    }
  })
)(SideBarContent);
