import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { timeDecrease, timeInitalize, gameResume, gamePause, soundsReady } from './actions';
import { connect } from 'react-redux';
import App from './components/App';

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

let { isRunning, time } = store.getState();
let intervalId;
store.subscribe(() => {
  let prevIsRunning = isRunning;
  let prevTime = time;
  ({ isRunning, time } = store.getState());

  if (time !== prevTime && time === 0 && isRunning) {
    // Time over
    clearInterval(intervalId);
    store.dispatch(gamePause());
    playChing(10 * 1000);
    return;
  }

  if (isRunning !== prevIsRunning && time > 0) {
    // Start/stop pause sound
    if (!isRunning) {
      radioSource = createSource(radio);
      radioSource.start(0);
    } else if (radioSource) {
      radioSource.stop(0);
      radioSource = undefined;
    }
  }

  if (isRunning !== prevIsRunning) {
    if (isRunning && intervalId === undefined) {
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

const appParams = {
  onTimeSet: value => store.dispatch(timeInitalize(value)),
  onResume: () => store.dispatch(gameResume()),
  onPause: () => store.dispatch(gamePause())
};

const VisibleApp = connect(({ isTimeSet }) => ({ isTimeSet}))(App);

render((
  <Provider store={store}>
    <VisibleApp {...appParams} />
  </Provider>
), document.getElementById('app'))
