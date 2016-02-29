import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { timeDecrease, timeInitalize, gameBegin, gameEnd, timeoutBegin, timeoutEnd } from './actions';
import Time from './components/Time';
import Input from './components/Input';
import ControlPanel from './components/ControlPanel';
// temporary: doesn't belong here
import { connect } from 'react-redux';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware // lets us dispatch() from actions
)(createStore);
const store = createStoreWithMiddleware(reducers);

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const decodeAudioData = context => data => new Promise((resolve, reject) => {
  context.decodeAudioData(data, buffer => resolve(buffer), e => reject(e));
});
const decode = decodeAudioData(audioCtx);

fetch('./ching.aac')
  .then(res => res.arrayBuffer())
  .then(data => decode(data))
  .then(buffer => {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.loop = true;
    source.start(0);
    setTimeout(() => {source.stop(0)}, 10 * 1000);
  });

let { inGame, inTimeout, time } = store.getState();
let intervalId;
store.subscribe(() => {
  let prevInGame = inGame;
  let prevInTimeout = inTimeout;
  let prevTime = time;
  ({ inGame, inTimeout, time } = store.getState());
  if (time !== prevTime && time === 0 && inGame && !inTimeout) {
    clearInterval(intervalId);
    store.dispatch(gameEnd());
    // sound once
    return;
  }

  if (inTimeout !== prevInTimeout) {
    if (inTimeout) {
      // sound on
    } else {
      // sound off
    }
  }

  if (inGame !== prevInGame || inTimeout !== prevInTimeout) {
    if (inGame && !inTimeout && intervalId === undefined) {
      intervalId = setInterval(() => {
        store.dispatch(timeDecrease(1))
      }, 1000);
    } else if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }
});

const VisibleInput = connect(({ inGame }) => ({ inGame }))(Input);
const VisibleTime = connect(({ time }) => ({ time }))(Time);
const VisibleControlPanel = connect(({ inGame, inTimeout }) => ({ inGame, inTimeout }))(ControlPanel);

render((
  <Provider store={store}>
    <div>
      <VisibleTime />
      <VisibleInput onChange={event => store.dispatch(timeInitalize(event.target.value))} />
      <VisibleControlPanel
        onBegin={event => store.dispatch(gameBegin(store.getState().gameTime))}
        onEnd={event => store.dispatch(gameEnd())}
        onPause={event => store.dispatch(timeoutBegin())}
        onResume={event => store.dispatch(timeoutEnd())} />
    </div>
  </Provider>
), document.getElementById('app'))
