export const TIME_INITIALIZE = 'TIME_INITIALIZE';
export const TIME_DECREASE = 'TIME_DECREASE';
export const GAME_RESUME = 'GAME_RESUME';
export const GAME_PAUSE = 'GAME_PAUSE';
export const SOUNDS_READY = 'SOUNDS_READY';

const parseDec = value => +value;

const valueToTime = value => {
  let numbers = value.split('').map(parseDec);
  let result = 0;
  let i = 0;
  let num;
  while ((num = numbers.pop()) !== undefined) {
    switch (i) {
      case 0:
        result += num;
        break;
      case 1:
        result += num * 10;
        break;
      default:
        result += num * 60 * Math.pow(10, i - 2);
        break;
    }
    i++;
  }
  return result;
}

export const timeInitalize = value => ({ type: TIME_INITIALIZE, payload: valueToTime(value) });
export const timeDecrease = value => ({ type: TIME_DECREASE, payload: value });
export const gameResume = () => ({ type: GAME_RESUME });
export const gamePause = () => ({ type: GAME_PAUSE });
export const soundsReady = () => ({ type: SOUNDS_READY });
