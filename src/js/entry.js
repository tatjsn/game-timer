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

let inGame, inTimeout, time, intervalId;
store.subscribe(() => {
  let prevInGame = inGame;
  let prevInTimeout = inTimeout;
  let prevTime = time;
  inGame = store.getState().inGame;
  inTimeout = store.getState().inTimeout;
  time = store.getState().time;
  if (time !== prevTime && time === 0 && inGame && !inTimeout) {
    clearInterval(intervalId);
    store.dispatch(gameEnd());
    return;
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

const InputC = connect(({ inGame }) => ({ inGame }))(Input);
const TimeC = connect(({ time }) => ({ time }))(Time);
const ControlPanelC = connect(({ inGame, inTimeout }) => ({ inGame, inTimeout }))(ControlPanel);
const App = () => (
  <div>
    <TimeC />
    <InputC onChange={event => store.dispatch(timeInitalize(event.target.value))} />
    <ControlPanelC
      onBegin={event => store.dispatch(gameBegin(store.getState().gameTime))}
      onEnd={event => store.dispatch(gameEnd())}
      onPause={event => store.dispatch(timeoutBegin())}
      onResume={event => store.dispatch(timeoutEnd())} />
  </div>
);

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'))
