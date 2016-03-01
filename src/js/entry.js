import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { timeDecrease, timeInitalize, gameBegin, gameEnd, timeoutBegin, timeoutEnd, soundsReady } from './actions';
import Time from './components/Time';
import Input from './components/Input';
import ControlPanel from './components/ControlPanel';
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
const createBufferSource = context => buffer => {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.loop = true;
  return source;
}

const decode = decodeAudioData(audioCtx);
const createSource = createBufferSource(audioCtx);

const fetchAac = url =>
  fetch(url)
  .then(res => res.arrayBuffer())
  .then(data => decode(data));

let radio, ching; // buffers
let radioSource, chingSource;
Promise.all(['./radio.aac', './ching.aac'].map(fetchAac))
  .then(([radioBuffer, chingBuffer]) => {
    radio = radioBuffer;
    ching = chingBuffer;
    store.dispatch(soundsReady());
  });

const playChing = duration => {
  if (ching) {
    chingSource = createSource(ching);
    chingSource.start(0);
    setTimeout(() => {
      chingSource.stop(0);
      chingSource = undefined;
    }, duration);
  }
}

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
    playChing(10 * 1000);
    return;
  }

  if (inTimeout !== prevInTimeout && radio) {
    if (inTimeout) {
      radioSource = createSource(radio);
      radioSource.start(0);
    } else if (radioSource) {
      radioSource.stop(0);
      radioSource = undefined;
    }
  }

  if (inGame !== prevInGame || inTimeout !== prevInTimeout) {
    if (inGame && !inTimeout && intervalId === undefined) {
      playChing(2 * 1000);
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
const VisibleControlPanel = connect(({ inGame, inTimeout, isReady }) => ({ inGame, inTimeout, isReady }))(ControlPanel);

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
