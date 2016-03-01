import { combineReducers } from 'redux';
import {
  TIME_INITIALIZE,
  TIME_DECREASE,
  GAME_BEGIN,
  GAME_END,
  TIMEOUT_BEGIN,
  TIMEOUT_END,
  SOUNDS_READY
} from './actions';

const gameTime = (state = 0, { type, payload }) => {
  switch (type) {
    case TIME_INITIALIZE:
      return payload;
    default:
      return state;
  }
}

const time = (state = 0, { type, payload }) => {
  switch (type) {
    case TIME_INITIALIZE:
    case GAME_BEGIN:
      return payload;
    case TIME_DECREASE:
      return state - payload;
    default:
      return state;
  }
}
const inGame = (state = false, { type }) =>  {
  switch (type) {
    case GAME_BEGIN:
      return true;
    case GAME_END:
      return false;
    default:
      return state;
  }
}

const inTimeout = (state = false, { type }) =>  {
  switch (type) {
    case TIMEOUT_BEGIN:
      return true;
    case TIMEOUT_END:
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
  gameTime,
  time,
  inGame,
  inTimeout,
  isReady
});
