export const TIME_INITIALIZE = 'TIME_INITIALIZE';
export const TIME_DECREASE = 'TIME_DECREASE';
export const GAME_BEGIN = 'GAME_BEGIN';
export const GAME_END = 'GAME_END';
export const TIMEOUT_BEGIN = 'TIMEOUT_BEGIN';
export const TIMEOUT_END = 'TIMEOUT_END';

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
export const gameBegin = value => ({ type: GAME_BEGIN, payload: value });
export const gameEnd = value => ({ type: GAME_END });
export const timeoutBegin = value => ({ type: TIMEOUT_BEGIN });
export const timeoutEnd = value => ({ type: TIMEOUT_END });
