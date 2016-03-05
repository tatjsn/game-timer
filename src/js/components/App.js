import React from 'react';
import Time from './Time';
import Input from './Input';
import ControlPanel from './ControlPanel';
import { connect } from 'react-redux';

const VisibleInput = connect(({ inGame }) => ({ inGame }))(Input);
const VisibleTime = connect(({ time }) => ({ time }))(Time);
const VisibleControlPanel = connect(({ isRunning, isReady }) => ({ isRunning, isReady }))(ControlPanel);

export default ({ isTimeSet, onTimeSet, onResume, onPause }) => (
  <div className="container">
    { isTimeSet ?
      <VisibleTime /> :
      <VisibleInput onTimeSet={onTimeSet} />
    }
    <VisibleControlPanel onResume={onResume} onPause={onPause} />
  </div>
);
