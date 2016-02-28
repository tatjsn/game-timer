import React from 'react';

export default ({ onBegin, onEnd, onPause, onResume, inGame, inTimeout }) => (
  <div>
    <button onClick={onBegin} disabled={inGame}>Begin</button>
    <button onClick={onEnd} disabled={!inGame}>End</button>
    <button onClick={onPause}>Pause</button>
    <button onClick={onResume}>Resume</button>
  </div>
)
