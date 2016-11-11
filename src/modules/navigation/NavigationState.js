import {fromJS} from 'immutable';
import {NavigationExperimental} from 'react-native';

const {StateUtils: NavigationStateUtils} = NavigationExperimental;

// Initial state
const initialState = fromJS({
  isSideBarShown: false,
  tabs: {
    index: 0,
    routes: [
      {key: 'HomeTab', title: 'HOME'},
      {key: 'QATab', title: 'Q&A'},
      {key: 'ChatTab', title: 'CHAT'},
      {key: 'LoginTab', title: 'LOGIN'}
    ]
  },
  // Scenes for the `HomeTab` tab.
  HomeTab: {
    index: 0,
    routes: [{key: 'HomeTab', title: 'HOME'}]
  },
  // Scenes for the `ChatTab` tab.
  ChatTab: {
    index: 0,
    routes: [{key: 'ChatTab', title: 'CHAT'}]
  },
  // Scenes for the `ChatTab` tab.
  QATab: {
    index: 0,
    routes: [{key: 'QATab', title: 'Q&A'}]
  },
  // Scenes for the `ChatTab` tab.
  LoginTab: {
    index: 0,
    routes: [{key: 'LoginTab', title: 'LOGIN'}]
  }
});

// Actions
const SWITCH_TAB = 'NavigationState/SWITCH_TAB';
const PUSH_ROUTE = 'NavigationState/PUSH_ROUTE';
const POP_ROUTE = 'NavigationState/POP_ROUTE';
const SIDEMENU_SET_OPEN = 'NavigationState/OPEN_SIDEBAR';
const SIDEMENU_SET_CLOSE = 'NavigationState/CLOSE_SIDEBAR';

// Action creators
export function switchTab(index) {
  return {
    type: SWITCH_TAB,
    payload: index
  };
}

export function pushRoute(route) {
  return {
    type: PUSH_ROUTE,
    payload: route
  };
}

export function popRoute() {
  return {type: POP_ROUTE};
}

export function setStateOpen() {
  return {
    type: SIDEMENU_SET_OPEN
  }
}

export function setStateClose() {
  return {
    type: SIDEMENU_SET_CLOSE
  }
}

// Reducer
export default function NavigationStateReducer(state = initialState, action) {
  switch (action.type) {
    case SWITCH_TAB: {
      // Switches the tab.
      const tabs = NavigationStateUtils.jumpToIndex(state.get('tabs').toJS(), action.payload);
      if (tabs !== state.get('tabs')) {
        return state.set('tabs', fromJS(tabs));
      }
      return state;
    }
    case PUSH_ROUTE: {
      // Push a route into the scenes stack.
      const route = action.payload;
      const tabs = state.get('tabs');
      const tabKey = tabs.getIn(['routes', tabs.get('index')]).get('key');
      const scenes = state.get(tabKey).toJS();
      let nextScenes;
      // fixes issue #52
      // the try/catch block prevents throwing an error when the route's key pushed
      // was already present. This happens when the same route is pushed more than once.
      try {
        nextScenes = NavigationStateUtils.push(scenes, route);
      } catch (e) {
        nextScenes = scenes;
      }
      if (scenes !== nextScenes) {
        return state.set(tabKey, fromJS(nextScenes));
      }
      return state;
    }
    case POP_ROUTE: {
      // Pops a route from the scenes stack.
      const tabs = state.get('tabs');
      const tabKey = tabs.getIn(['routes', tabs.get('index')]).get('key');
      const scenes = state.get(tabKey).toJS();
      const nextScenes = NavigationStateUtils.pop(scenes);
      if (scenes !== nextScenes) {
        return state.set(tabKey, fromJS(nextScenes));
      }
      return state;
    }
    case SIDEMENU_SET_OPEN: {
      return state.set('isSideBarShown', true);
    }
    case SIDEMENU_SET_CLOSE: {
      return state.set('isSideBarShown', false);
    }

    default:
      return state;
  }
}
