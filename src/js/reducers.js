import { combineReducers } from 'redux';
import {
  TIME_INITIALIZE,
  TIME_DECREASE,
  GAME_RESUME,
  GAME_PAUSE,
  GAME_OVER,
  SOUNDS_READY
} from './actions';

const time = (state = 0, { type, payload }) => {
  switch (type) {
    case TIME_INITIALIZE:
      return payload;
    case TIME_DECREASE:
      return state - payload;
    default:
      return state;
  }
}

const isTimeSet = (state = false, { type }) =>  {
  switch (type) {
    case TIME_INITIALIZE:
      return true;
    case GAME_OVER:
      return false;
    default:
      return state;
  }
}

const isRunning = (state = false, { type }) =>  {
  switch (type) {
    case GAME_RESUME:
      return true;
    case GAME_PAUSE:
      return false;
    default:
      return state;
  }
}

const isReady = (state = false, { type }) =>  {
  switch (type) {
    case SOUNDS_READY:
      return true;
    default:
      return state;
  }
}

export default combineReducers({
  time,
  isTimeSet,
  isRunning,
  isReady
});
